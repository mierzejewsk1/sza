const userQuery = require("../queries/userQueries");
const noteQuery = require("../queries/noteQueries")
const roomQuery = require("../queries/roomQueries")
const { StatusCodeEnum, ErrorCodeEnum } = require("../statusCodeEnum");
const { HeaderEnum } = require("../headersEnum");

const GetFilteredNotes = async (req, res) => {
  const userID = req.user.userID;
  const { amountOfNotes, roomNumber } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 1 && userTypeID !== 2)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof roomNumber != "string")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();
    if (typeof amountOfNotes != "number")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();

    let notesData;
    if (roomNumber === "") {
      notesData = await noteQuery.FindAllNotesWithLimit(amountOfNotes);
    } else {
      notesData = await noteQuery.FindAllNotesWithoutLimit();
    }

    let filteredNotesData = notesData;
    console.log(roomNumber);

    if (notesData !== undefined) {
      filteredNotesData = notesData.filter(item => (item.roomNumber.toString()).includes(roomNumber));
      return res.status(StatusCodeEnum.OK).json({ filteredNotesData });
    }

    return res.status(StatusCodeEnum.OK).json({ filteredNotesData });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const GetNotesForInhabitant = async (req, res) => {
  const userID = req.user.userID;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 4)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    const { roomID } = user;

    if (roomID === null)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_HAS_NO_ROOM).status(StatusCodeEnum.BAD_REQUEST).send();

    const notesData = await noteQuery.FindAllNotesByRoomId(roomID);

    return res.status(StatusCodeEnum.OK).json({ notesData });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const AddNote = async (req, res) => {
  const userID = req.user.userID;
  const { isForAllRoomsInConnector, roomNumberForAddNote, noteDescription } = req.body;
  try {
    let roomNumber = parseInt(roomNumberForAddNote);

    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 1 && userTypeID !== 2)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof (roomNumber) !== "number" || isNaN(roomNumber))
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof (isForAllRoomsInConnector) !== "number" || isNaN(roomNumber))
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof (noteDescription) !== "string")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    const [room] = await roomQuery.FindRoomByRoomNumber(roomNumber);
    if (room === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THERE_IS_NO_ROOM_WITH_THIS_ID).status(StatusCodeEnum.BAD_REQUEST).send();

    const { roomID, connectorID } = room;

    if (isForAllRoomsInConnector === 1) {
      const roomsData = await roomQuery.FindRoomsByConnectorId(connectorID);
      if (roomsData === undefined)
        return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THERE_IS_NO_ROOM_WITH_THIS_ID).status(StatusCodeEnum.BAD_REQUEST).send();

      await roomsData.map(item => {
        noteQuery.InsertNewNote(item.roomID, noteDescription, isForAllRoomsInConnector);
      })
      return res.status(StatusCodeEnum.OK).json({ msg: `Pomyślnie dodano uwagę` })
    }

    await noteQuery.InsertNewNote(roomID, noteDescription, isForAllRoomsInConnector);

    return res.status(StatusCodeEnum.OK).json({ msg: `Pomyślnie dodano uwagę` });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const DeleteNote = async (req, res) => {
  const userID = req.user.userID;
  const { noteID } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 1 && userTypeID !== 2)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    await noteQuery.DeleteNoteByNoteId(noteID);

    return res.status(StatusCodeEnum.OK).json({ msg: "Pomyślnie cofnięto uwagę" });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

module.exports = {
  GetFilteredNotes,
  GetNotesForInhabitant,
  AddNote,
  DeleteNote,
};
