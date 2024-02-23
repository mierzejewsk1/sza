const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireAllFields = require("../middleware/requireAllFields/requireAllFields");
const fields = require("../middleware/requireAllFields/requiredFields/laundryFields");
const userController = require("../controllers/userController");
const laundryController = require("../controllers/laundryController");
const router = express.Router();

router.use(requireAuth);

router.post(
  "/get-laundry-for-current-week",
  requireAllFields(fields.getLaundryForCurrentWeek),
  laundryController.GetLaundryForCurrentWeek,
)
router.post(
  "/reserve-laundry-washing-time",
  requireAllFields(fields.reserveLaundryWashingTime),
  laundryController.ReserveLaundryWashingTime,
)

router.delete(
  "/delete-laundry-reservation",
  requireAllFields(fields.deleteLaundryReservation),
  laundryController.DeleteLaundryReservation,
)

router.use(userController.ValidateLogin);

module.exports = router;