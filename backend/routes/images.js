const express = require("express");
const multer = require('multer');
const path = require("path");
const requireAuth = require("../middleware/requireAuth");
const userController = require("../controllers/userController");
const imageController = require("../controllers/imageController");
const router = express.Router();

router.use(requireAuth);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images'))
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage
})

router.post('/upload', upload.single('image'), imageController.SendImages);

router.use(userController.ValidateLogin);

module.exports = router;