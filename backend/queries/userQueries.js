const { mysql } = require("../lib/mysql");

const FindUserWithEmail = async (userEmail) => {
  let query = `SELECT userID, userEmail, userPassword, userToken, userResetPasswordToken, userTypeID, userName, isRoomAlone, roommateID, roomID, isPaid, userDepartment, userFieldOfStudy
      FROM o_users
      WHERE userEmail = ?
      LIMIT 1
    `;
  let values = [userEmail];

  return await mysql.app.select(query, values);
};

const FindUserById = async (userID) => {
  let query = `SELECT userID, userEmail, userPassword, userToken, userResetPasswordToken, userTypeID, userName, isRoomAlone, roommateID, roomID, isPaid, userDepartment, userFieldOfStudy, userImage
      FROM o_users
      WHERE userID = ?
      LIMIT 1
    `;
  let values = [userID];

  return await mysql.app.select(query, values);
};

const UpdateUserToken = async (userID, userToken) => {
  let query = `
    UPDATE o_users 
    SET userToken = ?
    WHERE userID = ?
    `;
  let values = [userToken, userID];

  return await mysql.app.update(query, values);
};

const FindUserTypeNameById = async (userID) => {
  let query = `
    SELECT c.userTypeName
    FROM o_users o
    JOIN c_user_types c ON o.userTypeID = c.userTypeID
    WHERE o.userID = ?
    LIMIT 1
    `;
  let values = [userID];

  return await mysql.app.select(query, values);
};

const UpdateUserResetPasswordToken = async (userID, userResetPasswordToken) => {
  let query = `
    UPDATE o_users 
    SET userResetPasswordToken = ?
    WHERE userID = ?
    `;
  let values = [userResetPasswordToken, userID];

  return await mysql.app.update(query, values);
}

const FindUserByResetToken = async userResetPasswordToken => {
  let query = `SELECT userID, userEmail, userPassword, userToken, userResetPasswordToken, userTypeID, userName, isRoomAlone, roommateID, roomID, isPaid, userDepartment, userFieldOfStudy
      FROM o_users
      WHERE userResetPasswordToken = ?
      LIMIT 1
    `;
  let values = [userResetPasswordToken];

  return await mysql.app.select(query, values);
}

const UpdateUserPassword = async (userID, userPassword) => {
  let query = `
    UPDATE o_users 
    SET userPassword = ?
    WHERE userID = ?
    `;
  let values = [userPassword, userID];

  return await mysql.app.update(query, values);
}

const FindUserRoomNumberById = async (userID) => {
  let query = `
  SELECT c.roomNumber
  FROM o_users o
  JOIN o_rooms c ON o.roomID = c.roomID
  WHERE o.userID = ?
  LIMIT 1
  `;
  let values = [userID];

  return await mysql.app.select(query, values);
}

const GetUserType = async (userID) => {
  let query = `SELECT userTypeID
      FROM o_users
      WHERE userID = ?
      LIMIT 1
    `;
  let values = [userID];

  return await mysql.app.select(query, values);
}

const CreateNotification = async (userID, notification) => {
  let query = `
  INSERT INTO o_notifications (userID, notificationDescription)
  VALUES ?
  `;
  let values = [[[userID, notification]]];

  return await mysql.app.insert(query, values);
}

const FindAmountOfIsRoomAloneUsers = async () => {
  let query = `SELECT COUNT(*) AS userAmount
  FROM o_users
  WHERE isRoomAlone = 1
  `;

  return await mysql.app.select(query);
}

const FindIfRoomSelectOpen = async () => {
  let query = `SELECT managementValue
  FROM c_management
  WHERE managementName = 'isRoomsSelectOpen'
  `;

  return await mysql.app.select(query);
}

const UpdateIsRoomSelectOpen = async (isRoomSelectOpen) => {
  let query = `
    UPDATE c_management 
    SET managementValue = ? 
    WHERE managementName = 'isRoomsSelectOpen'
  `;
  let values = [isRoomSelectOpen];
  return await mysql.app.update(query, values);
}

const FindAllInhabitantsWithLimit = async (amountOfVisibleInhabitants) => {
  let query = `SELECT u.userID, u.userEmail, u.userName, u.isRoomAlone, u.roomID, u.isPaid, u.userDepartment, u.userFieldOfStudy, r.roomNumber
      FROM o_users u LEFT JOIN o_rooms r ON u.roomID = r.roomID
      WHERE u.userTypeID = 4
      LIMIT ? ;
    `;
  let values = [amountOfVisibleInhabitants]
  return await mysql.app.select(query, values);
};

const FindAllInhabitantsWithoutLimit = async () => {
  let query = `SELECT u.userID, u.userEmail, u.userName, u.isRoomAlone, u.roomID, u.isPaid, u.userDepartment, u.userFieldOfStudy, r.roomNumber
      FROM o_users u LEFT JOIN o_rooms r ON u.roomID = r.roomID
      WHERE u.userTypeID = 4;
    `;
  return await mysql.app.select(query);
};


const FindAllEmployeesWithLimit = async (amountOfVisibleEmployees) => {
  let query = `SELECT u.userID, u.userEmail, u.userName, c.userTypeName
      FROM o_users u JOIN c_user_types c ON u.userTypeID = c.userTypeID
      WHERE u.userTypeID != 4
      LIMIT ? ;
    `;
  let values = [amountOfVisibleEmployees]
  return await mysql.app.select(query, values);
};

const FindAllEmployeesWithoutLimit = async () => {
  let query = `SELECT u.userID, u.userEmail, u.userName, c.userTypeName
  FROM o_users u JOIN c_user_types c ON u.userTypeID = c.userTypeID
  WHERE u.userTypeID != 4
    `;
  return await mysql.app.select(query);
};

const InsertNewEmployee = async (userNameForAdd, userEmailForAdd, hash, selectedTypeOfUser) => {
  let query = `
  INSERT INTO o_users (userName, userEmail, userPassword, userTypeID)
  VALUES ?
  `;
  let values = [[[userNameForAdd, userEmailForAdd, hash, selectedTypeOfUser]]];

  return await mysql.app.insert(query, values);
}

const DeleteEmployee = async (employeeID) => {
  let query = `
    DELETE FROM o_users WHERE userID = ?
  `;
  let values = [employeeID];

  return await mysql.app.delete(query, values);
}

const UpdateEmployeeById = async (employeeID, userName) => {
  let query = `
      UPDATE o_users 
      SET userName = ?
      WHERE userID = ?
    `;

  let values = [userName, employeeID];

  return await mysql.app.update(query, values);
}

const InsertNewInhabitant = async (userNameForAdd, userEmailForAdd, hash, selectedTypeOfUser, userDepartmentForAdd, userFieldOfStudyForAdd, isRoomAloneForAdd) => {
  let query = `
  INSERT INTO o_users (userName, userEmail, userPassword, userTypeID, userDepartment, userFieldOfStudy, isRoomAlone)
  VALUES ? ;
  `;
  let values = [[[userNameForAdd, userEmailForAdd, hash, selectedTypeOfUser, userDepartmentForAdd, userFieldOfStudyForAdd, isRoomAloneForAdd]]];

  return await mysql.app.insert(query, values);
}

const DeleteInhabitant = async (inhabitantID) => {
  let query = `
    DELETE FROM o_users WHERE userID = ?
  `;
  let values = [inhabitantID];

  return await mysql.app.delete(query, values);
}

const UpdateInhabitantById = async (inhabitantID, userName, userDepartment, userFieldOfStudy, isRoomAlone) => {
  let query = `
      UPDATE o_users 
      SET userName = ? , userDepartment = ? , userFieldOfStudy = ? , isRoomAlone = ?
      WHERE userID = ?
    `;

  let values = [userName, userDepartment, userFieldOfStudy, isRoomAlone, inhabitantID];

  return await mysql.app.update(query, values);
}

module.exports = {
  FindUserWithEmail,
  FindUserById,
  FindUserTypeNameById,
  UpdateUserToken,
  UpdateUserResetPasswordToken,
  FindUserByResetToken,
  UpdateUserPassword,
  FindUserRoomNumberById,
  GetUserType,
  CreateNotification,
  FindAmountOfIsRoomAloneUsers,
  FindIfRoomSelectOpen,
  UpdateIsRoomSelectOpen,
  FindAllInhabitantsWithLimit,
  FindAllInhabitantsWithoutLimit,
  FindAllEmployeesWithLimit,
  FindAllEmployeesWithoutLimit,
  InsertNewEmployee,
  DeleteEmployee,
  UpdateEmployeeById,
  InsertNewInhabitant,
  DeleteInhabitant,
  UpdateInhabitantById,
};
