const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userQuery = require("../queries/userQueries");
const { StatusCodeEnum, ErrorCodeEnum } = require("../statusCodeEnum");
const { HeaderEnum } = require("../headersEnum");

const mailer = require("../lib/mailer");
const mailerConfig = require("../lib/mailerConfig");

const createToken = (userID, expirationTime) => {
  return jwt.sign({ userID: userID }, process.env.SECRET, {
    expiresIn: expirationTime,
  });
};

const emailRegex = new RegExp(
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
);

const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!emailRegex.test(email))
    return res
      .setHeader(
        HeaderEnum.RESPONSE_HEADER,
        ErrorCodeEnum.INCORRECT_EMAIL_FORMAT
      )
      .status(StatusCodeEnum.BAD_REQUEST)
      .send();

  try {
    const [user] = await userQuery.FindUserWithEmail(email);
    if (user === undefined)
      return res
        .setHeader(
          HeaderEnum.RESPONSE_HEADER,
          ErrorCodeEnum.INCORRECT_EMAIL_OR_PASSWORD
        )
        .status(StatusCodeEnum.BAD_REQUEST)
        .send();

    const match = await bcrypt.compare(password, user.userPassword);
    if (!match)
      return res
        .setHeader(
          HeaderEnum.RESPONSE_HEADER,
          ErrorCodeEnum.INCORRECT_EMAIL_OR_PASSWORD
        )
        .status(StatusCodeEnum.BAD_REQUEST)
        .send();

    const [userData] = await userQuery.FindUserTypeNameById(user.userID);
    if (userData === undefined)
      return res
        .setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_HAS_NO_TYPE)
        .status(StatusCodeEnum.BAD_REQUEST)
        .send();
    const { userTypeName } = userData;

    const token = createToken(user.userID, "24h");
    await userQuery.UpdateUserToken(user.userID, token);
    return res.status(StatusCodeEnum.OK).json({ email, token, userTypeName });
  } catch (error) {
    console.error(error);
    return res
      .setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR)
      .status(StatusCodeEnum.INTERNAL_SERVER_ERROR)
      .send();
  }
};

const LogoutUser = async (req, res) => {
  const userID = req.user.userID;

  await userQuery.UpdateUserToken(userID, null);

  return res.status(StatusCodeEnum.OK).json({ msg: "Logged out successfully" });
};

const SendResetPasswordEmailHTML = async (req, res) => {
  const { email } = req.body

  const [user] = await userQuery.FindUserWithEmail(email);

  if (user === undefined)
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

  let userEmail = user.userEmail;

  const resetToken = createToken(user.userID, '15m')

  await userQuery.UpdateUserResetPasswordToken(user.userID, resetToken);

  const sender = mailerConfig.mailer['mailer.dla.stron@gmail.com'].auth.user;
  const address = email;
  const subject = '[SZA - System Zarządzania Akademikiem] Reset Hasła';
  const resetLink = `http://localhost:5173/get-new-password/?token=${resetToken}`;
  const html = await mailer.loadTemplate('resetPassword.html', { userEmail, resetLink })

  mailer.sendHTMLMail(sender, address, subject, html);
  return res.status(StatusCodeEnum.OK).json({ msg: 'Email sent succesfully' });

}

const ResetPassword = async (req, res) => {
  const { resetToken, newPassword, newPassword2 } = req.body;

  if (newPassword2 !== newPassword)
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PASSWORDS_DONT_MATCH).status(StatusCodeEnum.BAD_REQUEST).send();

  if (resetToken === undefined || resetToken === null)
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.NO_RESET_PASSWORD_TOKEN).status(StatusCodeEnum.BAD_REQUEST).send();

  try {
    const [user] = await userQuery.FindUserByResetToken(resetToken)

    if (user === undefined) {
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();
    }

    jwt.verify(resetToken, process.env.SECRET);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateUserPassword = userQuery.UpdateUserPassword(user.userID, hashedPassword);
    const updateUserResetPasswordToken = userQuery.UpdateUserResetPasswordToken(user.userID, null);

    await Promise.all([updateUserPassword, updateUserResetPasswordToken]);

    return res.status(StatusCodeEnum.OK).json({ msg: 'Password reset successfully' });
  }
  catch (error) {
    console.error(error);
    if (error instanceof jwt.TokenExpiredError)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.RESET_TOKEN_EXPIRED).status(StatusCodeEnum.UNAUTHORIZED).send();
    else
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const DisplayProfile = async (req, res) => {
  const userID = req.user.userID;
  try {
    let roomNumber = null;
    let roommateUserName = null;

    const [user] = await userQuery.FindUserById(userID);
    const { userEmail, userName, isRoomAlone, userDepartment, userFieldOfStudy, roommateID, roomID, userImage } = user;

    const [userRoomData] = await userQuery.FindUserRoomNumberById(user.userID);
    if (userRoomData !== undefined) roomNumber = userRoomData.roomNumber;

    const [roommateUserData] = (await userQuery.FindUserById(roommateID));
    if (roommateUserData !== undefined) roommateUserName = roommateUserData.userName;

    return res.status(StatusCodeEnum.OK).json({ userID, userEmail, userName, isRoomAlone, userDepartment, userFieldOfStudy, roomNumber, roommateUserName, roommateID, roomID, userImage })

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const DisplayProfileUsingQR = async (req, res) => {
  const { userId } = req.body;
  try {
    const userType = (await userQuery.GetUserType(userId))[0];
    if (userType.userTypeID !== 4)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_INHABITANT).status(StatusCodeEnum.BAD_REQUEST).send();

    const roomNumber = null;
    const [user] = await userQuery.FindUserById(userId);
    const [userRoomData] = await userQuery.FindUserRoomNumberById(user.userID);

    const { userEmail, userName, isRoomAlone, userDepartment, userFieldOfStudy } = user;
    if (userRoomData !== undefined) roomNumber = userRoomData.roomNumber;

    return res.status(StatusCodeEnum.OK).json({ userId, userEmail, userName, isRoomAlone, userDepartment, userFieldOfStudy, roomNumber })

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const ChangeRoomSelectOpen = async (req, res) => {
  const userID = req.user.userID;
  const { value } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_INHABITANT).status(StatusCodeEnum.BAD_REQUEST).send();

    await userQuery.UpdateIsRoomSelectOpen(value);
    return res.status(StatusCodeEnum.OK).json({ msg: 'Zmieniono stan zapisywania do pokoi' });

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const CheckIfRoomSelectOpen = async (req, res) => {
  try {
    const [room_select] = await userQuery.FindIfRoomSelectOpen();
    const { managementValue } = room_select;
    return res.status(StatusCodeEnum.OK).json({ managementValue })
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const GetFilteredInhabitants = async (req, res) => {
  const userID = req.user.userID;
  const { amountOfVisibleInhabitants, userNameForFilter } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof userNameForFilter != "string")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();
    if (typeof amountOfVisibleInhabitants != "number")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();

    let inhabitantsData;
    if (userNameForFilter === "") {
      inhabitantsData = await userQuery.FindAllInhabitantsWithLimit(amountOfVisibleInhabitants);
    } else {
      inhabitantsData = await userQuery.FindAllInhabitantsWithoutLimit();
    }

    let filteredInhabitantsData = inhabitantsData;

    if (inhabitantsData !== undefined) {
      filteredInhabitantsData = inhabitantsData.filter(item => (item.userName).includes(userNameForFilter));
      return res.status(StatusCodeEnum.OK).json({ filteredInhabitantsData });
    }

    return res.status(StatusCodeEnum.OK).json({ filteredInhabitantsData });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const AddInhabitant = async (req, res) => {
  const userID = req.user.userID;
  const { userNameForAdd, userEmailForAdd, userPasswordForAdd, userDepartmentForAdd, userFieldOfStudyForAdd, isRoomAloneForAdd } = req.body;
  try {

    if (typeof userNameForAdd !== "string" || userNameForAdd === "")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof userEmailForAdd !== "string" || userEmailForAdd === "")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof userPasswordForAdd !== "string" || userPasswordForAdd === "")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof userDepartmentForAdd !== "string" || userDepartmentForAdd === "")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof userFieldOfStudyForAdd !== "string" || userFieldOfStudyForAdd === "")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof isRoomAloneForAdd !== "number" || isNaN(isRoomAloneForAdd))
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    const inhabitantsData = await userQuery.FindAllInhabitantsWithoutLimit();

    const checkIfInhabitantExist = inhabitantsData.some(item => item.userEmail === userEmailForAdd);
    if (checkIfInhabitantExist)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.INHABITANT_WITH_THIS_EMAIL_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const employeesData = await userQuery.FindAllEmployeesWithoutLimit();

    const checkIfEmployeeExist = employeesData.some(item => item.userEmail === userEmailForAdd);
    if (checkIfEmployeeExist)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.EMPLOYEE_WITH_THIS_EMAIL_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();


    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.error('Wystąpił błąd generowania soli.');
        return;
      }

      bcrypt.hash(userPasswordForAdd, salt, (err, hash) => {
        if (err) {
          console.error('Wystąpił błąd haszowania zmiennej.');
          return;
        }
        userQuery.InsertNewInhabitant(userNameForAdd, userEmailForAdd, hash, 4, userDepartmentForAdd, userFieldOfStudyForAdd, isRoomAloneForAdd);
      });
    });

    return res.status(StatusCodeEnum.OK).json({ msg: `Pomyślnie dodano mieszkańca` });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const DeleteInhabitant = async (req, res) => {
  const userID = req.user.userID;
  const { inhabitantID } = req.body;
  try {

    if (typeof inhabitantID !== "number" || isNaN(inhabitantID))
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    const inhabitantsData = await userQuery.FindAllInhabitantsWithoutLimit();

    const checkIfInhabitantExist = inhabitantsData.some(item => item.userID === inhabitantID);
    if (!checkIfInhabitantExist)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.INHABITANT_IS_ALREADY_DELETED).status(StatusCodeEnum.BAD_REQUEST).send();

    await userQuery.DeleteInhabitant(inhabitantID);

    return res.status(StatusCodeEnum.OK).json({ msg: `Pomyślnie usunięto mieszkańca` });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const EditInhabitant = async (req, res) => {
  const { inhabitantID, userName, userDepartment, userFieldOfStudy, isRoomAlone } = req.body;
  const userID = req.user.userID;

  try {

    if (typeof inhabitantID !== "number" || isNaN(inhabitantID))
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof userName !== "string" || userName === "")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof userDepartment !== "string" || userDepartment === "")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof userFieldOfStudy !== "string" || userFieldOfStudy === "")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof isRoomAlone !== "number" || isNaN(isRoomAlone))
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    const inhabitantsData = await userQuery.FindAllInhabitantsWithoutLimit();

    const checkIfInhabitantExist = inhabitantsData.some(item => item.userID === inhabitantID);
    console.log(checkIfInhabitantExist);
    if (!checkIfInhabitantExist)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.INHABITANT_IS_ALREADY_DELETED).status(StatusCodeEnum.BAD_REQUEST).send();

    await userQuery.UpdateInhabitantById(inhabitantID, userName, userDepartment, userFieldOfStudy, isRoomAlone); // do zrobienia zapytanie

    return res.status(StatusCodeEnum.OK).json({ msg: 'Zaktualizowano dane mieszkańca' });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const GetFilteredEmployees = async (req, res) => {
  const userID = req.user.userID;
  const { amountOfVisibleEmployees, userNameForFilter } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof userNameForFilter != "string")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();
    if (typeof amountOfVisibleEmployees != "number")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();

    let employeesData;
    if (userNameForFilter === "") {
      employeesData = await userQuery.FindAllEmployeesWithLimit(amountOfVisibleEmployees);
    } else {
      employeesData = await userQuery.FindAllEmployeesWithoutLimit();
    }

    let filteredEmployeesData = employeesData;

    if (employeesData !== undefined) {
      filteredEmployeesData = employeesData.filter(item => (item.userName).includes(userNameForFilter));
      return res.status(StatusCodeEnum.OK).json({ filteredEmployeesData });
    }

    return res.status(StatusCodeEnum.OK).json({ filteredEmployeesData });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const AddEmployee = async (req, res) => {
  const userID = req.user.userID;
  const { userNameForAdd, userEmailForAdd, userPasswordForAdd, selectedTypeOfUser } = req.body;
  try {

    if (typeof selectedTypeOfUser !== "number" || isNaN(selectedTypeOfUser))
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof userNameForAdd !== "string" || userNameForAdd === "")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof userEmailForAdd !== "string" || userEmailForAdd === "")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof userPasswordForAdd !== "string" || userPasswordForAdd === "")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    const employeesData = await userQuery.FindAllEmployeesWithoutLimit();

    const checkIfEmployeeExist = employeesData.some(item => item.userEmail === userEmailForAdd);
    if (checkIfEmployeeExist)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.EMPLOYEE_WITH_THIS_EMAIL_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const inhabitantsData = await userQuery.FindAllInhabitantsWithoutLimit();

    const checkIfInhabitantExist = inhabitantsData.some(item => item.userEmail === userEmailForAdd);
    if (checkIfInhabitantExist)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.INHABITANT_WITH_THIS_EMAIL_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.error('Wystąpił błąd generowania soli.');
        return;
      }

      bcrypt.hash(userPasswordForAdd, salt, (err, hash) => {
        if (err) {
          console.error('Wystąpił błąd haszowania zmiennej.');
          return;
        }
        userQuery.InsertNewEmployee(userNameForAdd, userEmailForAdd, hash, selectedTypeOfUser);
      });
    });

    return res.status(StatusCodeEnum.OK).json({ msg: `Pomyślnie dodano pracownika` });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const DeleteEmployee = async (req, res) => {
  const userID = req.user.userID;
  const { employeeID } = req.body;
  try {

    if (typeof employeeID !== "number" || isNaN(employeeID))
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.BAD_VARIABLE_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();

    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    const employeesData = await userQuery.FindAllEmployeesWithoutLimit();

    const checkIfEmployeeExist = employeesData.some(item => item.userID === employeeID);
    if (!checkIfEmployeeExist)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.EMPLOYEE_IS_ALREADY_DELETED).status(StatusCodeEnum.BAD_REQUEST).send();

    await userQuery.DeleteEmployee(employeeID);

    return res.status(StatusCodeEnum.OK).json({ msg: `Pomyślnie usunięto pracownika` });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const EditEmployee = async (req, res) => {
  const { employeeID, userName } = req.body;
  const userID = req.user.userID;

  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { userTypeID } = (await userQuery.GetUserType(userID))[0];
    if (userTypeID !== 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_TYPE_CANNOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    const employeesData = await userQuery.FindAllEmployeesWithoutLimit();

    const checkIfEmployeeExist = employeesData.some(item => item.userID === employeeID);
    if (!checkIfEmployeeExist)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.EMPLOYEE_IS_ALREADY_DELETED).status(StatusCodeEnum.BAD_REQUEST).send();

    await userQuery.UpdateEmployeeById(employeeID, userName);

    return res.status(StatusCodeEnum.OK).json({ msg: 'Zaktualizowano dane pracownika' });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const ValidateLogin = async (req, res) => {
  return res.status(StatusCodeEnum.OK).send();
};

module.exports = {
  LoginUser,
  LogoutUser,
  ResetPassword,
  SendResetPasswordEmailHTML,
  DisplayProfile,
  DisplayProfileUsingQR,
  CheckIfRoomSelectOpen,
  ChangeRoomSelectOpen,
  GetFilteredInhabitants,
  GetFilteredEmployees,
  AddEmployee,
  DeleteEmployee,
  EditEmployee,
  AddInhabitant,
  DeleteInhabitant,
  EditInhabitant,
  ValidateLogin,
};
