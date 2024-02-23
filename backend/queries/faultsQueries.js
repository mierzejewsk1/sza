const { mysql } = require("../lib/mysql");

const FindAllUndoneFaults = async () => {
  let query = `SELECT f.faultID, f.faultDescription, f.faultTypeID, f.isDone, f.userID, f.insertTimestamp, t.faultTypeName, o.roomNumber
      FROM o_faults f JOIN c_faults_type t ON f.faultTypeID = t.faultTypeID JOIN o_users k ON f.userID = k.userID JOIN o_rooms o ON 
      k.roomID = o.roomID
      WHERE f.isDone = 0;
    `;

  return await mysql.app.select(query);
};

const FindAllDoneFaults = async () => {
  let query = `SELECT f.faultID, f.faultDescription, f.faultTypeID, f.isDone, f.userID, f.insertTimestamp, t.faultTypeName, o.roomNumber
      FROM o_faults f JOIN c_faults_type t ON f.faultTypeID = t.faultTypeID JOIN o_users k ON f.userID = k.userID JOIN o_rooms o ON 
      k.roomID = o.roomID
      WHERE f.isDone = 1;
    `;

  return await mysql.app.select(query);
};

const FindFaultsByUserId = async (userID) => {
  let query = `SELECT f.faultID, f.faultDescription, f.faultTypeID, f.isDone, f.userID, f.insertTimestamp, t.faultTypeName, o.roomNumber
      FROM o_faults f JOIN c_faults_type t ON f.faultTypeID = t.faultTypeID JOIN o_users k ON f.userID = k.userID JOIN o_rooms o ON 
      k.roomID = o.roomID
      WHERE f.userID = ?
      ORDER BY f.insertTimestamp DESC;
    `;
  let values = [userID];
  return await mysql.app.select(query, values);
};

const FindFaultTypeIdByFaultTypeName = async (faultTypeName) => {
  let query = `SELECT faultTypeID 
  FROM c_faults_type 
  WHERE faultTypeName LIKE ?
  LIMIT 1;
`;
  let values = [faultTypeName];
  return await mysql.app.select(query, values);
};

const InsertNewFault = async (faultDescription, faultTypeID, userID) => {
  let query = `INSERT INTO o_faults (faultDescription, faultTypeID, userID)
      VALUES ?
    `;
  let values = [[[faultDescription, faultTypeID, userID]]]
  return await mysql.app.select(query, values);
};

const FindFaultById = async (faultID) => {
  let query = `SELECT faultID, faultDescription, faultTypeID, isDone, userID, insertTimestamp 
      FROM o_faults 
      WHERE faultID = ? AND isDone = 0;
    `;
  let values = [faultID];
  return await mysql.app.select(query, values);
};

const DeleteFaultById = async (faultID) => {
  let query = `
    DELETE FROM o_faults WHERE faultID = ?
  `;
  let values = [faultID];

  return await mysql.app.delete(query, values);
}

const UpdateFaultById = async (faultID) => {
  let query = `
      UPDATE o_faults
      SET isDone = 1
      WHERE faultID = ?
    `;

  let values = [faultID];

  return await mysql.app.update(query, values);
}

module.exports = {
  FindAllUndoneFaults,
  FindAllDoneFaults,
  FindFaultsByUserId,
  InsertNewFault,
  FindFaultById,
  DeleteFaultById,
  UpdateFaultById,
  FindFaultTypeIdByFaultTypeName,
};
