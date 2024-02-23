const { mysql } = require("../lib/mysql");

const FindAmountOfRoomsWithTwoFreePlaces = async () => {
  let query = `SELECT COUNT(*) AS roomAmount
      FROM o_rooms
      WHERE roomCurrentCapacity = 2
    `;

  return await mysql.app.select(query);
};

const FindInhabitantsWithoutRoommate = async (userID) => {
  let query = `SELECT userID, userEmail, userName, roommateID, userDepartment, userFieldOfStudy
      FROM o_users
      WHERE userTypeID = 4 AND userID != ? AND roommateID IS NULL
    `;
  let values = [userID];

  return await mysql.app.select(query, values);
};

const FindUserRoommate = async (userID) => {
  let query = `SELECT userID
      FROM o_users
      WHERE roommateID = ?
      LIMIT 1
    `;
  let values = [userID];

  return await mysql.app.select(query, values);
}

const FindRoommateOfUser = async (userID) => {
  let query = `SELECT roommateID
      FROM o_users
      WHERE userID = ?
      LIMIT 1
    `;
  let values = [userID];

  return await mysql.app.select(query, values);
}


const FindAskingUserID = async (userID) => {
  let query = `SELECT requestID
      FROM o_roommate_request
      WHERE askingUserID = ?
      LIMIT 1
    `;
  let values = [userID];

  return await mysql.app.select(query, values);
}

const CreateRoommateRequest = async (userID, selectedUserID) => {
  let query = `
    INSERT INTO o_roommate_request (approverUserID, askingUserID)
    VALUES ?
  `;
  let values = [[[selectedUserID, userID]]];

  return await mysql.app.insert(query, values);
}

const UpdateRoommateID = async (userID, secondUserID) => {
  let query = `
      UPDATE o_users 
      SET roommateId = ? 
      WHERE userID = ?
    `;

  let values = [secondUserID, userID];

  return await mysql.app.update(query, values);
};

const DeleteRoommateRequest = async (askingUserID, userID) => {
  let query = `
    DELETE FROM o_roommate_request WHERE askingUserID = ? AND approverUserID = ?
  `;
  let values = [askingUserID, userID];

  return await mysql.app.delete(query, values);
}

const DeleteRoommateRequests = async (userID, askingUserID) => {
  let query = `
    DELETE FROM o_roommate_request WHERE approverUserID = ? OR approverUserID = ? OR askingUserID = ? OR askingUserID = ?
  `;
  let values = [userID, askingUserID, userID, askingUserID];

  return await mysql.app.delete(query, values);
}

const FindRequestsByUserId = async (userID) => {
  let query = `SELECT c.requestID, c.askingUserID, c.insertTimestamp, o.userName
      FROM o_roommate_request c
      JOIN o_users o ON o.userID = c.askingUserID
      WHERE approverUserID = ?
    `;
  let values = [userID];

  return await mysql.app.select(query, values);
}

const FindNotificationsByUserId = async (userID) => {
  let query = `SELECT notificationDescription
      FROM o_notifications
      WHERE userID = ?
    `;
  let values = [userID];

  return await mysql.app.select(query, values);
}

const GetAllRooms = async () => {
  let query = `SELECT roomID, roomNumber, roomFloor, connectorID, roomCapacity, roomCurrentCapacity, laundryAvaiableHours
      FROM o_rooms`
  return await mysql.app.select(query);
}

const FindRoomsByFloorNumber = async (floorNumber) => {
  let query = `SELECT roomID, roomNumber, roomFloor, connectorID, roomCapacity, roomCurrentCapacity, laundryAvaiableHours, rowNumberForDesign
      FROM o_rooms
      WHERE roomFloor = ?`
  let values = [floorNumber];
  return await mysql.app.select(query, values);
}

const FindUsersByRoomId = async (roomID) => {
  let query = `SELECT userID, userEmail, userName, isRoomAlone, roomID, userDepartment, userFieldOfStudy
      FROM o_users
      WHERE roomID = ?`
  let values = [roomID];
  return await mysql.app.select(query, values);
}

const FindRoomById = async (roomID) => {
  let query = `SELECT  roomID, roomNumber, roomFloor, connectorID, roomCapacity, roomCurrentCapacity, laundryAvaiableHours
      FROM o_rooms
      WHERE roomID = ?`
  let values = [roomID];
  return await mysql.app.select(query, values);
}

const FindAmountOfNedeedTwoPersonRooms = async () => {
  let query = `SELECT CAST(COUNT(*)/2 AS INTEGER) AS neededRoomsAmount
  FROM o_users
  WHERE roommateID IS NOT NULL AND roomID IS NULL
  `;

  return await mysql.app.select(query);
}

const UpdateRoomIdOfUser = async (roomID, userID) => {
  let query = `
      UPDATE o_users 
      SET roomID = ? 
      WHERE userID = ?
    `;
  let values = [roomID, userID];
  return await mysql.app.update(query, values);
}

const UpdateRoomCurrentCapacityOfRoom = async (roomID, number) => {
  let query = `
    UPDATE o_rooms 
    SET roomCurrentCapacity = ? 
    WHERE roomID = ?
  `;
  let values = [number, roomID];
  return await mysql.app.update(query, values);
}

const FindRoomsByConnectorId = async (connectorID) => {
  let query = `SELECT roomID, roomNumber, roomFloor, connectorID, roomCapacity, roomCurrentCapacity, laundryAvaiableHours
      FROM o_rooms
      WHERE connectorID = ?`
  let values = [connectorID];
  return await mysql.app.select(query, values);
}

const FindRoomByRoomNumber = async (roomNumber) => {
  let query = `SELECT  roomID, roomNumber, roomFloor, connectorID, roomCapacity, roomCurrentCapacity, laundryAvaiableHours
      FROM o_rooms
      WHERE roomNumber = ?`
  let values = [roomNumber];
  return await mysql.app.select(query, values);
}

module.exports = {
  FindAmountOfRoomsWithTwoFreePlaces,
  FindInhabitantsWithoutRoommate,
  FindUserRoommate,
  FindRoommateOfUser,
  FindAskingUserID,
  CreateRoommateRequest,
  UpdateRoommateID,
  DeleteRoommateRequest,
  DeleteRoommateRequests,
  FindRequestsByUserId,
  FindNotificationsByUserId,
  GetAllRooms,
  FindRoomsByFloorNumber,
  FindUsersByRoomId,
  FindRoomById,
  FindAmountOfNedeedTwoPersonRooms,
  UpdateRoomIdOfUser,
  UpdateRoomCurrentCapacityOfRoom,
  FindRoomsByConnectorId,
  FindRoomByRoomNumber,
};
