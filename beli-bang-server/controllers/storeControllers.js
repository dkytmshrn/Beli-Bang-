const { User, Store, Food } = require("../models");

class storeControllers {
  static async showStores(req, res, next) {
    try {
      const stores = await Store.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { status: true },
        include: [
          {
            model: User,
            attributes: { exclude: ["createdAt", "updatedAt", "password"] },
          },
        ],
      });
      res.status(200).json(stores);
    } catch (error) {
      next(error);
    }
  }

  static async findStore(req, res, next) {
    try {
      const { id } = req.params;
      const store = await Store.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: Food,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: User,
            attributes: { exclude: ["createdAt", "updatedAt", "password"] },
          },
        ],
      });
      if (!store) {
        throw { status: 404, message: "Store Not Found" };
      }
      res.status(200).json(store);
    } catch (error) {
      next(error);
    }
  }

  static async findStoreUser(req, res, next) {
    try {
      const UserId = req.user.id;
      const storeSeller = await Store.findOne({
        where: { UserId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: Food,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: User,
            attributes: { exclude: ["createdAt", "updatedAt", "password"] },
          },
        ],
      });
      if (!storeSeller) {
        throw { status: 404, message: "You have not registered a store" };
      }
      res.status(200).json(storeSeller);
    } catch (error) {
      next(error);
    }
  }

  static async createStore(req, res, next) {
    try {
      const { name, description, imgUrl: imageUrl } = req.body;

      const store = await Store.findOne({ where: { UserId: req.user.id } });
      if (store) {
        throw { status: 401, message: "You already have a store" };
      }

      await Store.create({
        name,
        imageUrl,
        description,
        UserId: req.user.id,
      });
      res.status(201).json({ message: "Success creating store" });
    } catch (error) {
      next(error);
    }
  }

  static async updateStore(req, res, next) {
    try {
      const { name, description, imgUrl: imageUrl } = req.body;
      const { id } = req.params;

      await Store.update({ name, description, imageUrl }, { where: { id } });

      res.status(200).json({ message: "Success updating store information" });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatusStore(req, res, next) {
    try {
      const { status } = req.body;
      const { id } = req.params;

      await Store.update({ status }, { where: { id } });

      res.status(200).json({ message: "Success updating store status" });
    } catch (error) {
      next(error);
    }
  }

  static async deleteStore(req, res, next) {
    try {
      await Store.destroy({ where: { id: req.params.id } });
      res.status(200).json({ message: "Store has been deleted" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = storeControllers;
