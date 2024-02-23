const userQuery = require("../queries/userQueries");
const roomQuery = require("../queries/roomQueries");
const { StatusCodeEnum, ErrorCodeEnum } = require("../statusCodeEnum");
const { HeaderEnum } = require("../headersEnum");


const SelectAmountOfRoomsWithTwoFreePlaces = async (req, res) => {
  try {
    const [roomData] = await roomQuery.FindAmountOfRoomsWithTwoFreePlaces();
    const { roomAmount } = roomData;
    return res.status(StatusCodeEnum.OK).json({ roomAmount })

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const SelectInhabitantsWithoutRoommate = async (req, res) => {
  const userID = req.user.userID;
  try {
    const inhabitantsData = await roomQuery.FindInhabitantsWithoutRoommate(userID);

    return res.status(StatusCodeEnum.OK).json({ inhabitantsData });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const SendRequestForSharedAccomodation = async (req, res) => {
  const userID = req.user.userID;
  const { selectedUserID } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const [selectedUser] = await userQuery.FindUserById(selectedUserID);
    if (selectedUser === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const userRoomID = user.roomID;
    const selectedUserRoomID = selectedUser.roomID;

    if (userRoomID !== null || selectedUserRoomID !== null)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_HAS_BEEN_ALREADY_ASSIGN_TO_ROOM).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 4)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_INHABITANT).status(StatusCodeEnum.BAD_REQUEST).send();

    const selectedUserTypeID = (await userQuery.GetUserType(selectedUserID))[0];
    if (selectedUserTypeID.userTypeID !== 4)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_INHABITANT).status(StatusCodeEnum.BAD_REQUEST).send();

    const userRoommate = (await roomQuery.FindUserRoommate(userID))[0];
    if (userRoommate !== undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_ROOMMATE_HAS_ALREADY_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const selectedUserRoommate = (await roomQuery.FindUserRoommate(selectedUserID))[0];
    if (selectedUserRoommate !== undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_ROOMMATE_HAS_ALREADY_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const askingUser = (await roomQuery.FindAskingUserID(userID))[0];
    if (askingUser !== undefined) {
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.ROOMMATE_REQUEST_HAS_BEEN_SENT).status(StatusCodeEnum.BAD_REQUEST).send();
    }

    const [roomData] = await roomQuery.FindAmountOfRoomsWithTwoFreePlaces();
    const { roomAmount } = roomData;
    if (roomAmount === 0) {
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.LACK_OF_TWO_PERSON_ROOMS).status(StatusCodeEnum.BAD_REQUEST).send();
    }
    await roomQuery.CreateRoommateRequest(userID, selectedUserID);
    const notification = "Masz nową prośbę o wspólne zamieszkanie!";
    await userQuery.CreateNotification(selectedUserID, notification);
    return res.status(StatusCodeEnum.OK).json({ msg: "Pomyślnie wysłano prośbę o wspólne zamieszkanie" });

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const ConsiderRequestForSharedAccommodation = async (req, res) => {
  const userID = req.user.userID;
  const { decision, askingUserID } = req.body;

  const [user] = await userQuery.FindUserById(userID);
  if (user === undefined)
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

  const [askingUser] = await userQuery.FindUserById(askingUserID);
  if (askingUser === undefined)
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

  const userRoomID = user.roomID;
  const askingUserRoomID = askingUser.roomID;

  if (userRoomID !== null || askingUserRoomID !== null)
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_HAS_BEEN_ALREADY_ASSIGN_TO_ROOM).status(StatusCodeEnum.BAD_REQUEST).send();

  if (userID === askingUserID)
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.CANT_ACCEPT_YOUR_OWN_REQUEST).status(StatusCodeEnum.BAD_REQUEST).send();

  const { userTypeID } = (await userQuery.GetUserType(userID))[0];
  if (userTypeID !== 4)
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_INHABITANT).status(StatusCodeEnum.BAD_REQUEST).send();

  const askingUserType = (await userQuery.GetUserType(askingUserID))[0];
  if (askingUserType.userTypeID !== 4)
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_INHABITANT).status(StatusCodeEnum.BAD_REQUEST).send();

  if (decision === true) {
    const userRoommate = (await roomQuery.FindUserRoommate(userID))[0];
    if (userRoommate !== undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_ROOMMATE_HAS_ALREADY_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const askingUserRoommate = (await roomQuery.FindUserRoommate(askingUserID))[0];
    if (askingUserRoommate !== undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_ROOMMATE_HAS_ALREADY_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const [roomData] = await roomQuery.FindAmountOfRoomsWithTwoFreePlaces();
    const { roomAmount } = roomData;
    if (roomAmount === 0) {
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.LACK_OF_TWO_PERSON_ROOMS).status(StatusCodeEnum.BAD_REQUEST).send();
    }

    await roomQuery.UpdateRoommateID(userID, askingUserID);
    await roomQuery.UpdateRoommateID(askingUserID, userID);
    await roomQuery.DeleteRoommateRequests(userID, askingUserID);
    return res.status(StatusCodeEnum.OK).json({ msg: "Pomyślnie dodano współlokatora" });
  }

  await roomQuery.DeleteRoommateRequest(askingUserID, userID);
  return res.status(StatusCodeEnum.OK).json({ msg: "Pomyślnie odrzucono współlokatora" });
}

const DisplayRoommateRequests = async (req, res) => {
  const userID = req.user.userID;
  try {
    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 4)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_INHABITANT).status(StatusCodeEnum.BAD_REQUEST).send();

    const requests = await roomQuery.FindRequestsByUserId(userID);
    return res.status(StatusCodeEnum.OK).json({ requests })

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const DisplayNotifications = async (req, res) => {
  const userID = req.user.userID;
  try {
    const notifications = await roomQuery.FindNotificationsByUserId(userID);
    return res.status(StatusCodeEnum.OK).json({ notifications })
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const CheckIfUserHasRoommate = async (req, res) => {
  const userID = req.user.userID;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();
    const { roomID } = user;

    let userHasRoommate = false;
    const roommateOfUser = (await roomQuery.FindRoommateOfUser(userID))[0];
    if (roommateOfUser.roommateID !== null)
      userHasRoommate = true;
    return res.status(StatusCodeEnum.OK).json({ userHasRoommate, roomID })
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const GetRoomsInfo = async (req, res) => {
  const userID = req.user.userID;
  const { floorNumber } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID === 3)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_INHABITANT).status(StatusCodeEnum.BAD_REQUEST).send();

    const roomsData = await roomQuery.FindRoomsByFloorNumber(floorNumber);
    if (roomsData === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.CANT_FIND_ROOMS_IN_DATABASE).status(StatusCodeEnum.BAD_REQUEST).send();

    return res.status(StatusCodeEnum.OK).json({ roomsData })

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const GetInfoAboutRoom = async (req, res) => {
  const userID = req.user.userID;
  const { roomId } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID === 3)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_INHABITANT).status(StatusCodeEnum.BAD_REQUEST).send();

    const [room] = await roomQuery.FindRoomById(roomId);
    if (room === undefined) {
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THERE_IS_NO_ROOM_WITH_THIS_ID).status(StatusCodeEnum.BAD_REQUEST).send();
    }
    const { roomCurrentCapacity, roomCapacity, roomID } = room

    const usersData = await roomQuery.FindUsersByRoomId(roomID);
    if (usersData === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.CANT_FIND_ROOMS_IN_DATABASE).status(StatusCodeEnum.BAD_REQUEST).send(); // error code to change
    return res.status(StatusCodeEnum.OK).json({ usersData, roomCurrentCapacity, roomCapacity, roomID })

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const ChooseSelectedRoom = async (req, res) => {
  const userID = req.user.userID;
  const { roomId } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID === 3)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_INHABITANT).status(StatusCodeEnum.BAD_REQUEST).send();

    const [room] = await roomQuery.FindRoomById(roomId);
    if (room === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THERE_IS_NO_ROOM_WITH_THIS_ID).status(StatusCodeEnum.BAD_REQUEST).send();

    const { roomID, isRoomAlone } = user
    if (roomID !== null)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_HAS_BEEN_ALREADY_ASSIGN_TO_ROOM).status(StatusCodeEnum.BAD_REQUEST).send();

    const { roommateID } = (await roomQuery.FindRoommateOfUser(userID))[0];
    let roommate;
    if (roommateID !== null) {
      roommate = (await userQuery.FindUserById(roommateID))[0];
      if (roommate.roomID !== null)
        return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.ROOMMATE_HAS_ROOM_ASSIGN).status(StatusCodeEnum.BAD_REQUEST).send();
    }

    const amountOfAvaiableRooms = (await roomQuery.FindAmountOfRoomsWithTwoFreePlaces())[0].roomAmount;

    const amountOfIsRoomAloneUsers = (await userQuery.FindAmountOfIsRoomAloneUsers())[0].userAmount;

    const amountOfNeededTwoPersonRooms = (await roomQuery.FindAmountOfNedeedTwoPersonRooms())[0].neededRoomsAmount + amountOfIsRoomAloneUsers;

    const { roomCurrentCapacity } = room;
    if (roomCurrentCapacity === 2 && (amountOfNeededTwoPersonRooms >= amountOfAvaiableRooms))
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.TOO_FEW_TWO_PERSON_ROOMS).status(StatusCodeEnum.BAD_REQUEST).send();

    if (roommateID !== null || isRoomAlone === 1) {
      if (roomCurrentCapacity < 2)
        return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.TOO_FEW_PLACES_IN_SELECTED_ROOM).status(StatusCodeEnum.BAD_REQUEST).send();
    }

    if (roomCurrentCapacity === 0)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.TOO_FEW_PLACES_IN_SELECTED_ROOM).status(StatusCodeEnum.BAD_REQUEST).send();

    let currentCapacity = roomCurrentCapacity;
    if (roommateID !== null && isRoomAlone === 0) {
      await roomQuery.UpdateRoomIdOfUser(room.roomID, userID);
      await roomQuery.UpdateRoomIdOfUser(room.roomID, roommateID);
      await roomQuery.UpdateRoomCurrentCapacityOfRoom(room.roomID, currentCapacity - 2);
    } else if (roommateID === null && isRoomAlone === 1) {
      await roomQuery.UpdateRoomIdOfUser(room.roomID, userID);
      await roomQuery.UpdateRoomCurrentCapacityOfRoom(room.roomID, currentCapacity - 2);
    } else {
      await roomQuery.UpdateRoomIdOfUser(room.roomID, userID);
      await roomQuery.UpdateRoomCurrentCapacityOfRoom(room.roomID, currentCapacity - 1);
    }

    return res.status(StatusCodeEnum.OK).json({ msg: `Udało się! Jesteś przypisany do pokoju ${room.roomNumber}` })

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const GetRooms = async (req, res) => {
  const userID = req.user.userID;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 1 && userTypeID !== 2)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    const roomsData = await roomQuery.GetAllRooms()
    if (roomsData === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.CANT_FIND_ROOMS_IN_DATABASE).status(StatusCodeEnum.BAD_REQUEST).send();

    return res.status(StatusCodeEnum.OK).json({ roomsData })

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

module.exports = {
  SelectAmountOfRoomsWithTwoFreePlaces,
  SelectInhabitantsWithoutRoommate,
  SendRequestForSharedAccomodation,
  ConsiderRequestForSharedAccommodation,
  DisplayRoommateRequests,
  DisplayNotifications,
  CheckIfUserHasRoommate,
  GetRoomsInfo,
  GetInfoAboutRoom,
  ChooseSelectedRoom,
  GetRooms,
};
