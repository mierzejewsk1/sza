const userQuery = require("../queries/userQueries");
const exchangeQuery = require("../queries/exchangeQueries");
const visitQuery = require("../queries/visitQueries");
const { StatusCodeEnum, ErrorCodeEnum } = require("../statusCodeEnum");
const { HeaderEnum } = require("../headersEnum");

const DisplayPendingVisits = async (req, res) => {
  const userID = req.user.userID;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 1 && userTypeID !== 2)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    const visitData = await visitQuery.FindPendingVisits();

    return res.status(StatusCodeEnum.OK).json({ visitData });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const DisplayVisitsByUserId = async (req, res) => {
  const userID = req.user.userID;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 4)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    const visitData = await visitQuery.FindVisitsByUserId(userID); // doz robienia zapytanie

    return res.status(StatusCodeEnum.OK).json({ visitData });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const GetFilteredVisits = async (req, res) => {
  const userID = req.user.userID;
  const { amountOfVisitors, visitorFilteredName } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 1 && userTypeID !== 2)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof visitorFilteredName != "string")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();
    if (typeof amountOfVisitors != "number")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();

    let visitsData;
    if (visitorFilteredName === "") {
      visitsData = await visitQuery.FindAllVisitsWithLimit(amountOfVisitors);
    } else {
      visitsData = await visitQuery.FindAllVisits();
    }

    let filteredVisitsData = visitsData;

    if (visitsData !== undefined) {
      filteredVisitsData = visitsData.filter(item => (item.visitorName.toString()).includes(visitorFilteredName));
      return res.status(StatusCodeEnum.OK).json({ filteredVisitsData });
    }

    return res.status(StatusCodeEnum.OK).json({ filteredVisitsData });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const AddVisit = async (req, res) => {
  const userID = req.user.userID;
  const { visitorName, visitorStartDate, visitorEndDate } = req.body;
  try {
    const startDate = new Date(visitorStartDate);
    startDate.setHours(startDate.getHours() + 2);
    const endDate = new Date(visitorEndDate);
    endDate.setHours(endDate.getHours() + 2);

    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 4)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof visitorName != "string")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();

    const [visit] = await visitQuery.FindVisitByVisitorName(userID, visitorName);
    if (visit !== undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.VISIT_HAS_ALREADY_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const [visitNumberForUser] = await visitQuery.FindVisitNumberForUser(userID);
    const { visitNumber } = visitNumberForUser;
    if (visitNumber > 3)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.CAN_NOT_ADD_MORE_VISITS).status(StatusCodeEnum.BAD_REQUEST).send();


    await visitQuery.InsertNewVisit(visitorName, startDate, endDate, userID);

    return res.status(StatusCodeEnum.OK).json({ msg: "Dodano nowe zapytanie o akceptację odwiedzin." });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const ConsiderRequestForAddVisit = async (req, res) => {
  const userID = req.user.userID;
  const { decision, visitorID } = req.body;

  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const [visit] = await visitQuery.FindVisitById(visitorID);
    if (visit === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.VISIT_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 1 && userTypeID !== 2)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    if (decision === true) {
      await visitQuery.UpdateVisitRequest(visitorID, 1);
      return res.status(StatusCodeEnum.OK).json({ msg: "Pomyślnie zatwierdzono prośbę o odwiedziny." });
    }

    await visitQuery.UpdateVisitRequest(visitorID, 2);

    return res.status(StatusCodeEnum.OK).json({ msg: "Pomyślnie odrzucono prośbę o odwiedziny." });

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const DeleteVisit = async (req, res) => {
  const userID = req.user.userID;
  const { visitorID } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID === 3)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    const [visit] = await exchangeQuery.FindVisitById(visitorID);
    if (visit === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.VISIT_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    await visitQuery.DeleteVisitRequest(visitorID);

    return res.status(StatusCodeEnum.OK).json({ msg: `Usunięto prośbę o odwiedziny` });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

module.exports = {
  DisplayPendingVisits,
  DisplayVisitsByUserId,
  AddVisit,
  ConsiderRequestForAddVisit,
  GetFilteredVisits,
  DeleteVisit,
};
