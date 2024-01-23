const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const authentication = require("../middlewares/authentication");
const upload = require("../middlewares/multer");
const imagekit = require("../middlewares/imageKit");

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.use(authentication);

router.patch("/users/username", userControllers.editUsername);
router.patch("/users/password", userControllers.editPassword);
router.patch("/users/phonenumber", userControllers.editPhoneNumber);
router.patch("/users/address", userControllers.editAddress);
router.patch("/users/profilepicture",
  upload.single("profilePicture"),
  imagekit,
  userControllers.editProfilePicture
);
router.patch("/users/location", userControllers.editlocation);

router.get("/users/:id", userControllers.fetchById);

module.exports = router;
