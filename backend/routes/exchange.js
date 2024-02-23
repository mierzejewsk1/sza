const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireAllFields = require("../middleware/requireAllFields/requireAllFields");
const fields = require("../middleware/requireAllFields/requiredFields/exchangeFields");
const userController = require("../controllers/userController");
const exchangeController = require("../controllers/exchangeController");
const router = express.Router();

router.use(requireAuth);

router.get(
  "/get-unaccepted-exchange",
  exchangeController.DisplayUnacceptedExchange,
)

router.get(
  "/get-accepted-exchange",
  exchangeController.DisplayAcceptedExchange,
)

router.get(
  "/get-accepted-exchange-by-id",
  exchangeController.DisplayAcceptedExchangeById,
)

router.post(
  "/add-exchange",
  requireAllFields(fields.addExchange),
  exchangeController.AddExchange,
)

router.post(
  "/consider-request-for-add-exchange",
  requireAllFields(fields.considerRequestForAddExchage),
  exchangeController.ConsiderRequestForAddExchange,
)

router.delete(
  "/delete-exchange",
  requireAllFields(fields.deleteExchange),
  exchangeController.DeleteExchange,
)

router.delete(
  "/delete-all-exchange",
  exchangeController.DeleteAllExchange,
)

router.use(userController.ValidateLogin);

module.exports = router;