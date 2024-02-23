const userQuery = require("../queries/userQueries");
const informationQuery = require("../queries/informationQueries");
const { StatusCodeEnum, ErrorCodeEnum } = require("../statusCodeEnum");
const { HeaderEnum } = require("../headersEnum");

const DisplayInformation = async (req, res) => {
  const { amountOfArticles } = req.body;
  try {
    const informationData = await informationQuery.FindInformation(amountOfArticles);

    return res.status(StatusCodeEnum.OK).json({ informationData });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const DisplayInformationForUser = async (req, res) => {
  const userID = req.user.userID;
  const { amountOfArticles } = req.body;
  try {
    const informationData = await informationQuery.FindInformationByUserId(amountOfArticles, userID);

    return res.status(StatusCodeEnum.OK).json({ informationData });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const AddInformation = async (req, res) => {
  const userID = req.user.userID;
  const { informationAddSubject, informationAddDescription } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID === 3 || userTypeID === 4)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    await informationQuery.InsertNewInformation(informationAddSubject, informationAddDescription, userID);

    return res.status(StatusCodeEnum.OK).json({ msg: "Dodano nowe ogłoszenie." });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const DeleteInformation = async (req, res) => {
  const userID = req.user.userID;
  const { informationID } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID === 3 || userTypeID === 4)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    const [information] = await informationQuery.FindInformationById(informationID);
    if (information === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.INFORMATION_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    await informationQuery.DeleteInformationById(informationID);

    return res.status(StatusCodeEnum.OK).json({ msg: `Usunięto ogłoszenie numer #${informationID}` });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const EditInformation = async (req, res) => {
  const { informationID } = req.body;
  const userID = req.user.userID;

  let informationObject = Object.keys(req.body).reduce((object, key) => {
    if (key !== "informationID") {
      object[key] = req.body[key];
    }
    return object;
  }, {});

  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID === 3 || userTypeID === 4)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    const [information] = await informationQuery.FindInformationById(informationID);
    if (information === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.INFORMATION_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const informationUserId = information.userID;
    if (informationUserId !== userID)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.CANT_EDIT_THIS_OBJECT).status(StatusCodeEnum.BAD_REQUEST).send();

    await informationQuery.UpdateInformationById(informationID, informationObject);

    return res.status(StatusCodeEnum.OK).json({ msg: 'Zaktualizowano ogłoszenie' });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const ValidateLogin = async (req, res) => {
  return res.status(StatusCodeEnum.OK).send();
};

module.exports = {
  DisplayInformation,
  DisplayInformationForUser,
  AddInformation,
  DeleteInformation,
  EditInformation,
  ValidateLogin,
};
