const loginFields = ["email", "password"];

const sendResetPasswordEmailPlainTextFields = ["email"];

const sendResetPasswordEmailHTMLFields = ["email"];

const resetPasswordFields = ["resetToken", "newPassword", "newPassword2"];

const qrProfileInfoFields = ["userId"];

const roomsSelectOpen = ["value"];

const getFilteredInhabitants = ["amountOfVisibleInhabitants", "userNameForFilter"];

const getFilteredEmployees = ["amountOfVisibleEmployees", "userNameForFilter"];

const addEmployee = ["userNameForAdd", "userEmailForAdd", "userPasswordForAdd", "selectedTypeOfUser"]

const editEmployee = ["employeeID", "userName"]

const deleteEmployee = ["employeeID"];

const addInhabitant = ["userNameForAdd", "userEmailForAdd", "userPasswordForAdd", "userDepartmentForAdd", "userFieldOfStudyForAdd", "isRoomAloneForAdd"]

const editInhabitant = ["inhabitantID", "userName", "userDepartment", "userFieldOfStudy"];

const deleteInhabitant = ["inhabitantID"];

module.exports = {
  loginFields,
  sendResetPasswordEmailPlainTextFields,
  sendResetPasswordEmailHTMLFields,
  resetPasswordFields,
  qrProfileInfoFields,
  roomsSelectOpen,
  getFilteredInhabitants,
  getFilteredEmployees,
  addEmployee,
  editEmployee,
  deleteEmployee,
  addInhabitant,
  editInhabitant,
  deleteInhabitant,
};
