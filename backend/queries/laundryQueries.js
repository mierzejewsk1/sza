const { mysql } = require("../lib/mysql");

const FindLaundryDataByDate = async (currentMonday, currentSunday) => {
  let query = `SELECT c.laundryID, c.laundryWashingDate, c.laundryWashingTime, r.roomNumber
      FROM o_laundry c JOIN o_users o ON c.userID = o.userID JOIN o_rooms r ON r.roomID = o.roomID
      WHERE laundryWashingDate >= ? AND laundryWashingDate <= ?
    `;
  let values = [currentMonday, currentSunday];
  return await mysql.app.select(query, values);
};

const FindAmountOfUsedHours = async (currentMonday, currentSunday, roomID) => {
  let query = `SELECT COUNT(*) AS hoursAmount
      FROM o_laundry 
      WHERE laundryWashingDate >= ? AND laundryWashingDate <= ? AND roomID = ?
    `;
  let values = [currentMonday, currentSunday, roomID];
  return await mysql.app.select(query, values);
};

const InsertNewLaundryWashing = async (selectedDayDate, washingHour, roomID, userID) => {
  let query = `
    INSERT INTO o_laundry (laundryWashingDate, laundryWashingTime, userID, roomID)
    VALUES ?
  `;
  let values = [[[selectedDayDate, washingHour, userID, roomID]]];

  return await mysql.app.insert(query, values);
}

const FindLaundryDataById = async (laundryID) => {
  let query = `SELECT laundryID, laundryWashingDate, laundryWashingTime, roomID, userID
      FROM o_laundry 
      WHERE laundryID = ? 
    `;
  let values = [laundryID];
  return await mysql.app.select(query, values);
};

const DeleteLaundryReservationById = async (laundryID) => {
  let query = `
    DELETE FROM o_laundry WHERE laundryID = ?
  `;
  let values = [laundryID];

  return await mysql.app.delete(query, values);
}

module.exports = {
  FindLaundryDataByDate,
  FindAmountOfUsedHours,
  InsertNewLaundryWashing,
  FindLaundryDataById,
  DeleteLaundryReservationById,

};
