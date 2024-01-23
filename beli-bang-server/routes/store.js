const express = require("express");
const router = express.Router();
const storeControllers = require("../controllers/storeControllers");
const {
  ownerAuthorization,
  sellerAuthorization,
} = require("../middlewares/authorization");
const upload = require("../middlewares/multer");
const imagekit = require("../middlewares/imageKit");

router.get("/stores", storeControllers.showStores);
router.get("/stores/seller", sellerAuthorization, storeControllers.findStoreUser);
router.get("/stores/:id", storeControllers.findStore);

router.post(
  "/stores",
  sellerAuthorization,
  upload.single("imageUrl"),
  imagekit,
  storeControllers.createStore
);

router.put(
  "/stores/:id",
  ownerAuthorization,
  upload.single("imageUrl"),
  imagekit,
  storeControllers.updateStore
);

router.patch("/stores/:id", ownerAuthorization, storeControllers.updateStatusStore);

router.delete("/stores/:id", ownerAuthorization, storeControllers.deleteStore);

module.exports = router;
