const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireAllFields = require("../middleware/requireAllFields/requireAllFields");
const fields = require("../middleware/requireAllFields/requiredFields/faultsFields");
const userController = require("../controllers/userController");
const faultsController = require("../controllers/faultsController");
const router = express.Router();

router.use(requireAuth);

router.get(
  "/get-all-undone-faults",
  faultsController.DisplayAllUndoneFaults,
)

router.get(
  "/get-all-done-faults",
  faultsController.DisplayAllDoneFaults,
)

router.get(
  "/get-faults-by-user-id",
  faultsController.DisplayFaultsByUserId,
)

router.post(
  "/add-faults",
  requireAllFields(fields.addFaults),
  faultsController.AddFaults,
)

router.delete(
  "/delete-faults",
  requireAllFields(fields.deleteFaults),
  faultsController.DeleteFaults,
)

router.patch(
  "/set-fault-as-done",
  requireAllFields(fields.setFaultAsDone),
  faultsController.SetFaultAsDone,
)

router.use(userController.ValidateLogin);

module.exports = router;