const express = require("express");
const router = express.Router();
const orderControllers = require("../controllers/orderControllers");
const { sellerAuthorization } = require("../middlewares/authorization");

router.get("/orders/customer", orderControllers.showOrderCustomers);
router.get("/orders/seller", orderControllers.showOrderSellers);
router.post("/orders", orderControllers.createOrder);
router.get("/orders/:id", orderControllers.findOrder);
router.put("/orders/:id", orderControllers.updateOrder);
router.delete("/orders/:id", orderControllers.deleteOrder);

module.exports = router;