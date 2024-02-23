const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireAllFields = require("../middleware/requireAllFields/requireAllFields");
const fields = require("../middleware/requireAllFields/requiredFields/visitFields");
const userController = require("../controllers/userController");
const visitController = require("../controllers/visitController");
const router = express.Router();

router.use(requireAuth);

router.get(
  "/get-pending-visits",
  visitController.DisplayPendingVisits,
)

router.get(
  "/get-visits-by-id",
  visitController.DisplayVisitsByUserId,
)

router.post(
  "/add-visit",
  requireAllFields(fields.addVisit),
  visitController.AddVisit,
)

router.post(
  "/consider-request-for-add-visit",
  requireAllFields(fields.considerRequestForAddVisit),
  visitController.ConsiderRequestForAddVisit,
)

router.post(
  "/get-filtered-visits",
  requireAllFields(fields.getFilteredVisits),
  visitController.GetFilteredVisits,
)


router.use(userController.ValidateLogin);

module.exports = router;