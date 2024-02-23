const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireAllFields = require("../middleware/requireAllFields/requireAllFields");
const fields = require("../middleware/requireAllFields/requiredFields/userFields");
const userController = require("../controllers/userController");
const router = express.Router();

router.post(
  "/login",
  requireAllFields(fields.loginFields),
  userController.LoginUser
);
router.patch(
  "/reset-password",
  requireAllFields(fields.resetPasswordFields),
  userController.ResetPassword
);

router.post(
  "/send-reset-password-email-html",
  requireAllFields(fields.sendResetPasswordEmailHTMLFields),
  userController.SendResetPasswordEmailHTML
);

router.use(requireAuth);
router.post("/logout", userController.LogoutUser);
router.get("/profile", userController.DisplayProfile);
router.post(
  "/qr-profile-info",
  requireAllFields(fields.qrProfileInfoFields),
  userController.DisplayProfileUsingQR
);

router.get("/rooms-select-open", userController.CheckIfRoomSelectOpen);

router.post(
  "/rooms-select-open",
  requireAllFields(fields.roomsSelectOpen),
  userController.ChangeRoomSelectOpen
);

router.post(
  "/get-filtered-inhabitants",
  requireAllFields(fields.getFilteredInhabitants),
  userController.GetFilteredInhabitants,
)

router.post(
  "/get-filtered-employees",
  requireAllFields(fields.getFilteredEmployees),
  userController.GetFilteredEmployees,
)

router.post(
  "/add-employee",
  requireAllFields(fields.addEmployee),
  userController.AddEmployee,
)

router.patch(
  "/edit-employee",
  requireAllFields(fields.editEmployee),
  userController.EditEmployee,
)

router.delete(
  "/delete-employee",
  requireAllFields(fields.deleteEmployee),
  userController.DeleteEmployee,
)

router.post(
  "/add-inhabitant",
  requireAllFields(fields.addInhabitant),
  userController.AddInhabitant,
)

router.patch(
  "/edit-inhabitant",
  requireAllFields(fields.editInhabitant),
  userController.EditInhabitant,
)

router.delete(
  "/delete-inhabitant",
  requireAllFields(fields.deleteInhabitant),
  userController.DeleteInhabitant,
)
router.use(userController.ValidateLogin);

module.exports = router;