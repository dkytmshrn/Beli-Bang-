const { RatingStore, Store } = require('../models')

class ratingStoreControllers {
  static async findRating(req, res, next) {
    try {
      const { storeId } = req.params

      const store = await Store.findByPk(storeId)
      if (!store) {
        throw { status: 404, message: "Store not found" }
      }
      const rating = await RatingStore.findAll({
        where: {StoreId: storeId}
      })
      if (rating.length == 0) {
        throw { status: 404, message: "Haven't got any rating yet" }
      }   
      res.status(200).json(rating)
    } catch (error) {
      next (error)
    }
  }

  static async createRating(req, res, next) {
    try {
      const { storeId } = req.params
      const { score } = req.body

      const checker = await RatingStore.findOne({
        where: { StoreId: storeId, UserId: req.user.id }
      })
      if (checker) {
        throw { status: 401, message: "Store already rated" }
      }
      await RatingStore.create({ StoreId: storeId, UserId: req.user.id, score })
      res.status(201).json({ message: "Success rating store" })
    } catch (error) {
      next (error)
    }
  }

  static async updateRating(req, res, next) {
    try {
      const { id } = req.params
      const { score } = req.body

      const rating = await RatingStore.findByPk(id)
      if (!rating) {
        throw { status: 404, message: "Rating not found" }
      } else if (rating.UserId != req.user.id) {
        throw { status: 403, message: "Not authorized" }
      }
      await RatingStore.update({ score }, { where: { id } })
      res.status(200).json({ message: "Success updating rating" })
    } catch (error) {
      next (error)
    }
  }

  static async deleteRating(req, res, next) {
    try {
      const { id } = req.params

      const rating = await RatingStore.findByPk(id)
      if (!rating) {
        throw { status: 404, message: "Rating not found"}
      } else if (rating.UserId != req.user.id) {
        throw { status: 403, message: "Not authorized" }
      }
      await RatingStore.destroy({where: { id } })
      
      res.status(200).json({ message: "Rating has been removed" })
    } catch (error) {
      next (error)
    }
  }
}

module.exports = ratingStoreControllers