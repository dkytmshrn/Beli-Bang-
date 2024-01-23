const express = require("express");
const likeControllers = require("../controllers/likeControllers");
const router = express.Router();

router.get("/likes/:storeId", likeControllers.findLikes);
router.post("/likes/:storeId", likeControllers.createLike);
router.delete("/likes/:id", likeControllers.deleteLike);

module.exports = router;