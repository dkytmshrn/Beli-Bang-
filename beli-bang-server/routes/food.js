const express = require("express");
const router = express.Router();
const foodControllers = require("../controllers/foodControllers");
const { sellerAuthorization, foodOwnerAuthorization } = require("../middlewares/authorization");
const upload = require("../middlewares/multer");
const imagekit = require("../middlewares/imageKit");

router.post("/foods",
  sellerAuthorization,
  upload.single("imageUrl"),
  imagekit,
  foodControllers.createFood
);
router.get("/foods/:id", foodControllers.findFood);
router.put("/foods/:id",
  foodOwnerAuthorization,
  upload.single("imageUrl"),
  imagekit,
  foodControllers.updateFood
);
router.delete("/foods/:id", foodOwnerAuthorization, foodControllers.deleteFood);

module.exports = router;