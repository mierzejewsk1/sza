const userQuery = require("../queries/userQueries");
const informationQuery = require("../queries/informationQueries");
const exchangeQuery = require("../queries/exchangeQueries");
const { StatusCodeEnum, ErrorCodeEnum } = require("../statusCodeEnum");
const { HeaderEnum } = require("../headersEnum");

const DisplayUnacceptedExchange = async (req, res) => {
  const userID = req.user.userID;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const exchangeData = await exchangeQuery.FindUnacceptedExchange();

    return res.status(StatusCodeEnum.OK).json({ exchangeData });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const DisplayAcceptedExchange = async (req, res) => {
  const userID = req.user.userID;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const exchangeData = await exchangeQuery.FindAcceptedExchange();

    return res.status(StatusCodeEnum.OK).json({ exchangeData });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const DisplayAcceptedExchangeById = async (req, res) => {
  const userID = req.user.userID;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const exchangeData = await exchangeQuery.FindAcceptedExchangeById(userID);

    return res.status(StatusCodeEnum.OK).json({ exchangeData });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const AddExchange = async (req, res) => {
  const userID = req.user.userID;
  const { exchangeSubject, exchangeDescription } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 4)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    await exchangeQuery.InsertNewExchange(exchangeSubject, exchangeDescription, userID);

    return res.status(StatusCodeEnum.OK).json({ msg: "Dodano nową ofertę wymiany do zatwierdzenia." });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const ConsiderRequestForAddExchange = async (req, res) => {
  const userID = req.user.userID;
  const { decision, exchangeID } = req.body;

  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const [exchange] = await exchangeQuery.FindExchangeById(exchangeID);
    if (exchange === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.EXCHANGE_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 1 && userTypeID !== 2)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    if (decision === true) {
      await exchangeQuery.UpdateExchangeRequest(exchangeID);
      return res.status(StatusCodeEnum.OK).json({ msg: "Pomyślnie zatwierdzono ofertę wymiany." });
    }

    await exchangeQuery.DeleteExchangeRequest(exchangeID);
    return res.status(StatusCodeEnum.OK).json({ msg: "Pomyślnie odrzucono ofertę wymiany." });

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const DeleteExchange = async (req, res) => {
  const userID = req.user.userID;
  const { exchangeID } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID === 3)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    const [exchange] = await exchangeQuery.FindAllExchangeById(exchangeID);
    if (exchange === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.EXCHANGE_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    await exchangeQuery.DeleteExchangeRequest(exchangeID);

    return res.status(StatusCodeEnum.OK).json({ msg: `Usunięto ofertę wymiany numer #${exchangeID}` });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const DeleteAllExchange = async (req, res) => {
  const userID = req.user.userID;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    await exchangeQuery.DeleteAllExchange();

    return res.status(StatusCodeEnum.OK).json({ msg: `Usunięto wszystkie oferty wymiany` });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

module.exports = {
  DisplayAcceptedExchange,
  DisplayUnacceptedExchange,
  AddExchange,
  ConsiderRequestForAddExchange,
  DeleteExchange,
  DisplayAcceptedExchangeById,
  DeleteAllExchange
};
