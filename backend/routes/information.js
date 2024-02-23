const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireAllFields = require("../middleware/requireAllFields/requireAllFields");
const fields = require("../middleware/requireAllFields/requiredFields/informationFields");
const userController = require("../controllers/userController");
const informationController = require("../controllers/informationController");
const router = express.Router();

router.use(requireAuth);

router.post(
  "/get-information",
  requireAllFields(fields.getInformation),
  informationController.DisplayInformation,
)

router.post(
  "/get-information-for-user",
  requireAllFields(fields.getInformation),
  informationController.DisplayInformationForUser,
)

router.post(
  "/add-information",
  requireAllFields(fields.addInformation),
  informationController.AddInformation,
)

router.delete(
  "/delete-information",
  requireAllFields(fields.deleteInformation),
  informationController.DeleteInformation,
)

router.patch(
  "/edit-information",
  requireAllFields(fields.editInformation),
  informationController.EditInformation,
)

router.use(userController.ValidateLogin);

module.exports = router;