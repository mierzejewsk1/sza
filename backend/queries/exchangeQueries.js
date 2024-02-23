const { mysql } = require("../lib/mysql");

const FindAcceptedExchange = async () => {
  let query = `SELECT c.exchangeID, c.userID, c.exchangeSubject, c.exchangeDescription, c.isAccepted, c.insertTimestamp, o.userName, w.roomNumber
      FROM o_exchange c JOIN o_users o ON o.userID = c.userID JOIN o_rooms w ON o.roomID = w.roomID 
      WHERE c.isAccepted = 1
      ORDER BY c.insertTimestamp DESC;
    `;

  return await mysql.app.select(query);
};

const FindAcceptedExchangeById = async (userID) => {
  let query = `SELECT c.exchangeID, c.userID, c.exchangeSubject, c.exchangeDescription, c.isAccepted, c.insertTimestamp, o.userName, w.roomNumber
      FROM o_exchange c JOIN o_users o ON o.userID = c.userID JOIN o_rooms w ON o.roomID = w.roomID 
      WHERE c.isAccepted = 1 AND c.userID = ?
      ORDER BY c.insertTimestamp DESC;
    `;
  let values = [userID]

  return await mysql.app.select(query, values);
};

const FindUnacceptedExchange = async () => {
  let query = `SELECT c.exchangeID, c.userID, c.exchangeSubject, c.exchangeDescription, c.isAccepted, c.insertTimestamp, o.userName, w.roomNumber
      FROM o_exchange c JOIN o_users o ON o.userID = c.userID JOIN o_rooms w ON o.roomID = w.roomID 
      WHERE c.isAccepted = 0
      ORDER BY c.insertTimestamp DESC;
    `;

  return await mysql.app.select(query);
};

const InsertNewExchange = async (exchangeSubject, exchangeDescription, userID) => {
  let query = `INSERT INTO o_exchange (userID, exchangeSubject, exchangeDescription, isAccepted)
      VALUES ?
    `;
  let values = [[[userID, exchangeSubject, exchangeDescription, 0]]]
  return await mysql.app.select(query, values);
};

const FindExchangeById = async (exchangeID) => {
  let query = `SELECT exchangeID, userID, exchangeSubject, exchangeDescription, isAccepted, insertTimestamp
      FROM o_exchange
      WHERE exchangeID = ? AND isAccepted = 0;
    `;
  let values = [exchangeID];

  return await mysql.app.select(query, values);
};

const FindAllExchangeById = async (exchangeID) => {
  let query = `SELECT exchangeID, userID, exchangeSubject, exchangeDescription, isAccepted, insertTimestamp
      FROM o_exchange
      WHERE exchangeID = ?;
    `;
  let values = [exchangeID];

  return await mysql.app.select(query, values);
};

const UpdateExchangeRequest = async (exchangeID) => {
  let query = `
      UPDATE o_exchange 
      SET isAccepted = 1
      WHERE exchangeID = ?
    `;
  let values = [exchangeID];

  return await mysql.app.update(query, values);
}

const DeleteExchangeRequest = async (exchangeID) => {
  let query = `
    DELETE FROM o_exchange WHERE exchangeID = ?
  `;
  let values = [exchangeID];

  return await mysql.app.delete(query, values);
}

const DeleteAllExchange = async () => {
  let query = `
    DELETE FROM o_exchange WHERE exchangeID > 0
  `;

  return await mysql.app.delete(query);
}

module.exports = {
  FindAcceptedExchange,
  FindUnacceptedExchange,
  InsertNewExchange,
  FindExchangeById,
  UpdateExchangeRequest,
  DeleteExchangeRequest,
  FindAllExchangeById,
  FindAcceptedExchangeById,
  DeleteAllExchange,
};
