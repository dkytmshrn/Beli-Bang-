const { RatingFood, Food } = require('../models')

class ratingFoodControllers {
  static async findRating(req, res, next) {
    try {
      const { foodId } = req.params

      const food = await Food.findByPk(foodId)
      if (!food) {
        throw { status: 404, message: "Food not found" }
      }
      const rating = await RatingFood.findAll({
        where: {FoodId: foodId}
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
      const { foodId } = req.params
      const { score } = req.body

      const checker = await RatingFood.findOne({
        where: { FoodId: foodId, UserId: req.user.id }
      })
      if (checker) {
        throw { status: 401, message: "Food already rated" }
      }
      await RatingFood.create({ FoodId: foodId, UserId: req.user.id, score })
      res.status(201).json({ message: "Success rating food" })
    } catch (error) {
      next (error)
    }
  }

  static async updateRating(req, res, next) {
    try {
      const { id } = req.params
      const { score } = req.body

      const rating = await RatingFood.findByPk(id)
      if (!rating) {
        throw { status: 404, message: "Rating not found" }
      } else if (rating.UserId != req.user.id) {
        throw { status: 403, message: "Not authorized" }
      }
      await RatingFood.update({ score }, { where: { id } })
      res.status(200).json({ message: "Success updating rating" })
    } catch (error) {
      next (error)
    }
  }

  static async deleteRating(req, res, next) {
    try {
      const { id } = req.params

      const rating = await RatingFood.findByPk(id)
      if (!rating) {
        throw { status: 404, message: "Rating not found"}
      } else if (rating.UserId != req.user.id) {
        throw { status: 403, message: "Not authorized" }
      }
      await RatingFood.destroy({where: { id } })

      res.status(200).json({ message: "Rating has been removed"})
    } catch (error) {
      next (error)
    }
  }
}

module.exports = ratingFoodControllers