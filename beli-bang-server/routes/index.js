const express = require("express");
const router = express.Router();

const userRouter = require("./user")
const authentication = require("../middlewares/authentication")
const storeRouter = require("./store")
const foodRouter = require("./food")
const orderRouter = require("./order")
const likeRouter = require("./like")
const ratingStoreRouter = require("./ratingStore")
const ratingFoodRouter = require("./ratingFood")

router.use(userRouter)

router.use(authentication)

router.use(storeRouter)
router.use(foodRouter)
router.use(orderRouter)
router.use(likeRouter)
router.use(ratingStoreRouter)
router.use(ratingFoodRouter)

module.exports = router;