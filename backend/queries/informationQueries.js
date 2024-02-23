const { mysql } = require("../lib/mysql");

const FindInformation = async (amountOfArticles) => {
  let query = `SELECT c.informationID, c.userID, c.informationSubject, c.informationDescription, c.insertTimestamp, o.userName
      FROM o_information c JOIN o_users o ON o.userID = c.userID
      ORDER BY c.insertTimestamp DESC
      LIMIT ? ;
    `;
  let values = [amountOfArticles]
  return await mysql.app.select(query, values);
};

const FindInformationByUserId = async (amountOfArticles, userID) => {
  let query = `SELECT c.informationID, c.userID, c.informationSubject, c.informationDescription, c.insertTimestamp, o.userName
      FROM o_information c JOIN o_users o ON o.userID = c.userID
      WHERE c.userID = ?
      ORDER BY c.insertTimestamp DESC
      LIMIT ? ;
    `;
  let values = [userID, amountOfArticles]
  return await mysql.app.select(query, values);
};

const InsertNewInformation = async (informationSubject, informationDescription, userID) => {
  let query = `INSERT INTO o_information (userID, informationSubject, informationDescription)
      VALUES ?
    `;
  let values = [[[userID, informationSubject, informationDescription]]]
  return await mysql.app.select(query, values);
};

const FindInformationById = async (informationID) => {
  let query = `SELECT informationID, userID, informationSubject, informationDescription, insertTimestamp
      FROM o_information
      WHERE informationID = ?
    `;
  let values = [informationID];
  return await mysql.app.select(query, values);
};

const DeleteInformationById = async (informationID) => {
  let query = `
    DELETE FROM o_information WHERE informationID = ?
  `;
  let values = [informationID];

  return await mysql.app.delete(query, values);
}

const UpdateInformationById = async (informationID, informationObject) => {
  let query = `
      UPDATE o_information 
      SET ? 
      WHERE informationID = ?
    `;

  let values = [informationObject, informationID];

  return await mysql.app.update(query, values);
}

module.exports = {
  FindInformation,
  InsertNewInformation,
  DeleteInformationById,
  FindInformationById,
  UpdateInformationById,
  FindInformationByUserId
};
