const userQuery = require("../queries/userQueries");
const roomQuery = require("../queries/roomQueries");
const laundryQuery = require("../queries/laundryQueries")
const { StatusCodeEnum, ErrorCodeEnum } = require("../statusCodeEnum");
const { HeaderEnum } = require("../headersEnum");

const GetLaundryForCurrentWeek = async (req, res) => {
  const userID = req.user.userID;
  const { Monday, Sunday } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID === 3)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_INHABITANT).status(StatusCodeEnum.BAD_REQUEST).send();

    const laundryData = await laundryQuery.FindLaundryDataByDate(Monday, Sunday);

    return res.status(StatusCodeEnum.OK).json({ laundryData });

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const ReserveLaundryWashingTime = async (req, res) => {
  const userID = req.user.userID;
  const { dayNumber, washingHour } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 4)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_INHABITANT).status(StatusCodeEnum.BAD_REQUEST).send();

    const { roomID } = user;
    if (roomID === null)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_HAS_BEEN_ALREADY_ASSIGN_TO_ROOM).status(StatusCodeEnum.BAD_REQUEST).send();

    const room = (await roomQuery.FindRoomById(roomID))[0];
    if (room === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THERE_IS_NO_ROOM_WITH_THIS_ID).status(StatusCodeEnum.BAD_REQUEST).send();

    let d1 = new Date();
    var day1 = d1.getDay(),
      diff1 = d1.getDate() - day1 + (day1 == 0 ? -5 : 2);
    let currentMonday = new Date(d1.setDate(diff1));
    currentMonday.setHours(-24, 0, 0, 0);
    let currentSunday = new Date(currentMonday);
    currentSunday.setDate(currentMonday.getDate() + 6);
    currentSunday.setHours(23, 59, 59, 59);

    const amountOfHoursUsed = (await laundryQuery.FindAmountOfUsedHours(currentMonday, currentSunday, roomID))[0];

    if (amountOfHoursUsed.hoursAmount === 2)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.MORE_HOURS_NOT_AVAIABLE).status(StatusCodeEnum.BAD_REQUEST).send();

    d2 = new Date();
    var day2 = d2.getDay(),
      diff2 = d2.getDate() - day2 + (day2 === 0 ? 0 : dayNumber);

    const selectedDayDate = new Date(d2.setDate(diff2));
    selectedDayDate.setHours(0, 0, 0, 0);

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 2);
    if (parseInt(currentDate.getHours()) >= parseInt(washingHour.split(':')[0]) && selectedDayDate.getDate() === currentDate.getDate())
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.CAN_NOT_ADD_PAST_WASHING).status(StatusCodeEnum.BAD_REQUEST).send();

    await laundryQuery.InsertNewLaundryWashing(selectedDayDate, washingHour, roomID, userID);

    return res.status(StatusCodeEnum.OK).json({ msg: "Pomyślnie zarezerwowano godzinę prania." });

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const DeleteLaundryReservation = async (req, res) => {
  const userID = req.user.userID;
  const { laundryID } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 4)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_INHABITANT).status(StatusCodeEnum.BAD_REQUEST).send();

    const { roomID } = user;
    if (roomID === null)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_HAS_BEEN_ALREADY_ASSIGN_TO_ROOM).status(StatusCodeEnum.BAD_REQUEST).send();

    const laundry = (await laundryQuery.FindLaundryDataById(laundryID))[0];
    if (laundry === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THERE_IS_NO_LAUNDRY_WITH_THIS_ID).status(StatusCodeEnum.BAD_REQUEST).send();

    if (roomID !== laundry.roomID)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.CANT_MANAGE_NOT_YOUR_ROOM).status(StatusCodeEnum.BAD_REQUEST).send();


    const [laundryData] = await laundryQuery.FindLaundryDataById(laundryID);
    const { laundryWashingDate, laundryWashingTime } = laundryData;

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 2);
    if (parseInt(currentDate.getHours()) >= parseInt(laundryWashingTime.split(':')[0]))
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.CAN_NOT_DELETE_PAST_WASHING).status(StatusCodeEnum.BAD_REQUEST).send();

    await laundryQuery.DeleteLaundryReservationById(laundryID);

    return res.status(StatusCodeEnum.OK).json({ msg: "Pomyślnie usunięto wybraną godzinę prania" });

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const ValidateLogin = async (req, res) => {
  return res.status(StatusCodeEnum.OK).send();
};

module.exports = {
  GetLaundryForCurrentWeek,
  ReserveLaundryWashingTime,
  DeleteLaundryReservation,
  ValidateLogin,
};
