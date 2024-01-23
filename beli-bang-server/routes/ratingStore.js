const express = require("express");
const ratingStoreControllers = require("../controllers/ratingStoreControllers");
const router = express.Router();

router.get("/ratingstores/:storeId", ratingStoreControllers.findRating);
router.post("/ratingstores/:storeId", ratingStoreControllers.createRating);
router.put("/ratingstores/:id", ratingStoreControllers.updateRating);
router.delete("/ratingstores/:id", ratingStoreControllers.deleteRating);

module.exports = router;