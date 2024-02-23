const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireAllFields = require("../middleware/requireAllFields/requireAllFields");
const fields = require("../middleware/requireAllFields/requiredFields/noteFields");
const userController = require("../controllers/userController");
const noteController = require("../controllers/noteController");
const router = express.Router();

router.use(requireAuth);

router.post(
  "/get-filtered-notes",
  requireAllFields(fields.getFilteredNotes),
  noteController.GetFilteredNotes,
)

router.get(
  "/get-notes-for-inhabitant",
  noteController.GetNotesForInhabitant,
)

router.post(
  "/add-note",
  requireAllFields(fields.addNote),
  noteController.AddNote,
)

router.delete(
  "/delete-note",
  requireAllFields(fields.deleteNote),
  noteController.DeleteNote,
)
router.use(userController.ValidateLogin);

module.exports = router;