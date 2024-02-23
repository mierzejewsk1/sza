const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireAllFields = require("../middleware/requireAllFields/requireAllFields");
const fields = require("../middleware/requireAllFields/requiredFields/roomFields");
const userController = require("../controllers/userController");
const roomController = require("../controllers/roomController");
const router = express.Router();

router.use(requireAuth);

router.post(
  "/send-request-for-shared-accommodation",
  requireAllFields(fields.requestForSharedAccommodationFields),
  roomController.SendRequestForSharedAccomodation
)

router.post(
  "/consider-request-for-shared-accommodation",
  requireAllFields(fields.considerRequestForSharedAccommodation),
  roomController.ConsiderRequestForSharedAccommodation
)

router.get(
  "/get-rooms-with-two-free-places",
  roomController.SelectAmountOfRoomsWithTwoFreePlaces
);
router.get(
  "/get-inhabitants-without-roommate",
  roomController.SelectInhabitantsWithoutRoommate
);

router.get(
  "/display-roommate-requests",
  roomController.DisplayRoommateRequests
);

router.get(
  "/display-notifications",
  roomController.DisplayNotifications
);

router.get(
  "/check-if-user-has-roommate",
  roomController.CheckIfUserHasRoommate,
)

router.post(
  "/get-rooms-info",
  requireAllFields(fields.getRoomsInfoFields),
  roomController.GetRoomsInfo,
)

router.post(
  "/get-info-about-room",
  requireAllFields(fields.getInfoAboutRoom),
  roomController.GetInfoAboutRoom,
)

router.patch(
  "/choose-selected-room",
  requireAllFields(fields.chooseSelectedRoom),
  roomController.ChooseSelectedRoom,
)

router.get(
  "/get-rooms",
  roomController.GetRooms,
)

router.use(userController.ValidateLogin);

module.exports = router;