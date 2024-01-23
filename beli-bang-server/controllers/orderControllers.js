const redis = require("../helpers/redis");
const { Store, User, Food, Order } = require("../models");
const axios = require("axios");

class orderControllers {
  static async showOrderCustomers(req, res, next) {
    try {
      const orders = await Order.findAll({
        order: [["status", "DESC"]],
        where: { UserId: req.user.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: User,
            attributes: { exclude: ["createdAt", "updatedAt", "password"] },
          },
          {
            model: Store,
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
              {
                model: User,
                attributes: { exclude: ["createdAt", "updatedAt", "password"] },
              },
            ],
          },
        ],
      });

      if (orders.length == 0) {
        throw { status: 404, message: "No order has been made" };
      }
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  static async showOrderSellers(req, res, next) {
    //40-70
    try {
      const id = req.user.id;

      const store = await Store.findOne({
        where: { UserId: id },
        include: [
          {
            model: User,
            attributes: { exclude: ["createdAt", "updatedAt", "password"] },
          },
        ],
      });

      if (!store) {
        throw { status: 404, message: "Store not found" };
      }

      const orders = await Order.findAll({
        order: [["status", "DESC"]],
        where: { StoreId: store.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: User,
            attributes: { exclude: ["createdAt", "updatedAt", "password"] },
          },
        ],
      });
      if (orders.length == 0) {
        throw { status: 404, message: "No order has been made" };
      }

      const locationSeller = store.User.location;
      res.status(200).json({ locationSeller, orders });
    } catch (error) {
      next(error);
    }
  }

  static async findOrder(req, res, next) {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) {
        throw { status: 404, message: "Order Not Found" };
      }

      const id = order.StoreId;
      const store = await Store.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: User,
            attributes: { exclude: ["createdAt", "updatedAt", "password"] },
          },
        ],
      });

      const customer = await User.findOne({
        attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        where: { id: order.UserId },
      });

      res.status(200).json({ store, customer });
    } catch (error) {
      next(error);
    }
  }

  static async createOrder(req, res, next) {
    try {
      const { StoreId, status } = req.body;

      await Order.create({ StoreId, UserId: req.user.id, status });

      // token-notification store
      const store = await Store.findOne({
        where: { id: StoreId },
      });

      const tokenCache = await redis.get(`tokens:notification:${store.UserId}`);

      if (tokenCache) {
        const expoPushToken = JSON.parse(tokenCache);

        const user = await User.findByPk(req.user.id);

        const message = {
          to: expoPushToken,
          sound: "default",
          title: "Beli Bang!!",
          body: `You have a new order from ${user.username}`,
          data: { someData: "goes here" },
        };

        await axios("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          data: message,
        });
      }

      res.status(201).json({ message: "Success creating order" });
    } catch (error) {
      next(error);
    }
  }

  static async updateOrder(req, res, next) {
    try {
      const { status } = req.body;

      const order = await Order.findByPk(req.params.id);
      if (!order) {
        throw { status: 404, message: "Order Not Found" };
      }

      await Order.update({ status }, { where: { id: req.params.id } });
      res.status(200).json({ message: "Success updating order status" });
    } catch (error) {
      next(error);
    }
  }

  static async deleteOrder(req, res, next) {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) {
        throw { status: 404, message: "Order Not Found" };
      }
      await Order.destroy({ where: { id: req.params.id } });
      res.status(200).json({ message: "Order has been deleted" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = orderControllers;
