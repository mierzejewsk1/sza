const { mysql } = require("../lib/mysql");

const FindAllNotesWithLimit = async (amountOfArticles) => {
  let query = `SELECT n.noteID, n.roomID, n.isForAllRoomsInConnector, n.noteDescription, n.insertTimestamp, r.roomNumber
      FROM o_notes n JOIN o_rooms r ON n.roomID = r.roomID
      ORDER BY n.insertTimestamp DESC
      LIMIT ? ;
    `;
  let values = [amountOfArticles]
  return await mysql.app.select(query, values);
};

const FindAllNotesWithoutLimit = async () => {
  let query = `SELECT n.noteID, n.roomID, n.isForAllRoomsInConnector, n.noteDescription, n.insertTimestamp, r.roomNumber
      FROM o_notes n JOIN o_rooms r ON n.roomID = r.roomID
      ORDER BY n.insertTimestamp DESC;
    `;
  return await mysql.app.select(query);
};

const FindAllNotesByRoomId = async (roomID) => {
  let query = `SELECT n.noteID, n.roomID, n.isForAllRoomsInConnector, n.noteDescription, n.insertTimestamp, r.roomNumber
      FROM o_notes n JOIN o_rooms r ON n.roomID = r.roomID
      WHERE n.roomID = ?
      ORDER BY n.insertTimestamp DESC;
    `;
  let values = [roomID]
  return await mysql.app.select(query, values);
};

const InsertNewNote = async (roomID, noteDescription, isForAllRoomsInConnector) => {
  let query = `
    INSERT INTO o_notes (roomID, isForAllRoomsInConnector, noteDescription)
    VALUES ?
  `;
  let values = [[[roomID, isForAllRoomsInConnector, noteDescription]]];

  return await mysql.app.insert(query, values);
}

const DeleteNoteByNoteId = async (noteID) => {
  let query = `
    DELETE FROM o_notes WHERE noteID = ?
  `;
  let values = [noteID];

  return await mysql.app.delete(query, values);
}

module.exports = {
  FindAllNotesWithLimit,
  FindAllNotesWithoutLimit,
  FindAllNotesByRoomId,
  InsertNewNote,
  DeleteNoteByNoteId,
};
