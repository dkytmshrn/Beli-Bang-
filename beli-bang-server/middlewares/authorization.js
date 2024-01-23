const { Store, Food } = require("../models");

async function sellerAuthorization(req, res, next) {
  try {
    if (req.user.role !== "Seller") {
      throw { status: 403, message: "Forbidden for the seller" };
    }
    next();
  } catch (error) {
    next(error);
  }
}

async function ownerAuthorization(req, res, next) {
  try {
    const { id } = req.params;
    const store = await Store.findByPk(id);
    if (!store) {
      throw { status: 404, message: "Store Not Found" };
    }

    if (req.user.role !== "Seller" || req.user.id !== store.UserId) {
      throw { status: 403, message: "Forbidden for the owner" };
    }
    next();
  } catch (error) {
    next(error);
  }
}

async function foodOwnerAuthorization(req, res, next) {
  try {
    const food = await Food.findByPk(req.params.id, {
      include: { model: Store, attributes: ["UserId"] },
    });
    if (!food) {
      throw { status: 404, message: "Food not found" };
    }
    if (food.Store.UserId !== req.user.id) {
      throw { status: 403, message: "Not the Owner" };
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { sellerAuthorization, ownerAuthorization, foodOwnerAuthorization };
