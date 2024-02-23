const { mysql } = require("../lib/mysql");

const FindPendingVisits = async () => {
  let query = `
      SELECT v.visitorID, v.userID, v.visitorName, v.visitorStartDate, v.visitorEndDate, v.isAccepted, v.insertTimestamp, u.userName, r.roomNumber
      FROM o_visitors v JOIN o_users u ON v.userID = u.userID JOIN o_rooms r ON u.roomID = r.roomID 
      WHERE v.isAccepted = 0
      ORDER BY v.insertTimestamp DESC;
    `;

  return await mysql.app.select(query);
};

const FindAllVisits = async () => {
  let query = `
      SELECT v.visitorID, v.userID, v.visitorName, v.visitorStartDate, v.visitorEndDate, v.isAccepted, v.insertTimestamp, u.userName, r.roomNumber
      FROM o_visitors v JOIN o_users u ON v.userID = u.userID JOIN o_rooms r ON u.roomID = r.roomID 
      ORDER BY v.insertTimestamp DESC;
    `;

  return await mysql.app.select(query);
};

const FindAllVisitsWithLimit = async (amountOfVisits) => {
  let query = `
      SELECT v.visitorID, v.userID, v.visitorName, v.visitorStartDate, v.visitorEndDate, v.isAccepted, v.insertTimestamp, u.userName, r.roomNumber
      FROM o_visitors v JOIN o_users u ON v.userID = u.userID JOIN o_rooms r ON u.roomID = r.roomID 
      ORDER BY v.insertTimestamp DESC
      LIMIT ?
    `;
  let values = [amountOfVisits];
  return await mysql.app.select(query, values);
};


const FindVisitsByUserId = async (userID) => {
  let query = `
      SELECT v.visitorID, v.userID, v.visitorName, v.visitorStartDate, v.visitorEndDate, v.isAccepted, v.insertTimestamp, u.userName, r.roomNumber
      FROM o_visitors v JOIN o_users u ON v.userID = u.userID JOIN o_rooms r ON u.roomID = r.roomID 
      WHERE v.userID = ?
      ORDER BY v.insertTimestamp DESC;
    `;
  let values = [userID];
  return await mysql.app.select(query, values);
};

const InsertNewVisit = async (visitorName, startDate, endDate, userID) => {
  let query = `INSERT INTO o_visitors (userID, visitorName, visitorStartDate, visitorEndDate, isAccepted)
      VALUES ?
    `;
  let values = [[[userID, visitorName, startDate, endDate, 0]]]
  return await mysql.app.select(query, values);
};

const FindVisitById = async (visitID) => {
  let query = `
      SELECT v.visitorID, v.userID, v.visitorName, v.visitorStartDate, v.visitorEndDate, v.isAccepted, v.insertTimestamp, u.userName, r.roomNumber
      FROM o_visitors v JOIN o_users u ON v.userID = u.userID JOIN o_rooms r ON u.roomID = r.roomID 
      WHERE v.visitorID = ?
      ORDER BY v.insertTimestamp DESC;
    `;
  let values = [visitID];
  return await mysql.app.select(query, values);
};

const UpdateVisitRequest = async (visitorID, decision) => {
  let query = `
      UPDATE o_visitors
      SET isAccepted = ?
      WHERE visitorID = ?
    `;
  let values = [decision, visitorID];

  return await mysql.app.update(query, values);
}

const FindVisitByVisitorName = async (userID, visitorName) => {
  let query = `
      SELECT v.visitorID, v.userID, v.visitorName, v.visitorStartDate, v.visitorEndDate, v.isAccepted, v.insertTimestamp, u.userName, r.roomNumber
      FROM o_visitors v JOIN o_users u ON v.userID = u.userID JOIN o_rooms r ON u.roomID = r.roomID 
      WHERE v.userID = ? AND v.visitorName = ?
    `;
  let values = [userID, visitorName];
  return await mysql.app.select(query, values);
}

const FindVisitNumberForUser = async (userID) => {
  let query = `
      SELECT COUNT(*) AS visitNumber 
      FROM o_visitors
      WHERE userID = ? AND isAccepted = 0; 
    `;
  let values = [userID];
  return await mysql.app.select(query, values);
}

module.exports = {
  FindPendingVisits,
  FindVisitsByUserId,
  InsertNewVisit,
  FindVisitById,
  UpdateVisitRequest,
  FindAllVisits,
  FindAllVisitsWithLimit,
  FindVisitByVisitorName,
  FindVisitNumberForUser,

};
