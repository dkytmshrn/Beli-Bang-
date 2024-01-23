const { Store, Like } = require('../models')

class likeControllers {
  static async findLikes(req, res, next) {
    try {
      const { storeId } = req.params

      const store = await Store.findByPk(storeId)
      if (!store) {
        throw { status: 404, message: "Store not found" }
      }
      const likes = await Like.findAll({
        where: {StoreId: storeId}
      })
      if (likes.length == 0) {
        throw { status: 404, message: "Haven't got any like yet" }
      }
      res.status(200).json(likes)
    } catch (error) {
      next (error)
    }
  }

  static async createLike(req, res, next) {
    try {
      const { storeId } = req.params

      const checker = await Like.findOne({
        where: { StoreId: storeId, UserId: req.user.id }
      })
      if (checker) {
        throw { status: 401, message: "Like already added" }
      }
      await Like.create({ StoreId: storeId, UserId: req.user.id })
      res.status(201).json({ message: "Success adding like" })
    } catch (error) {
      next (error)
    }
  }

  static async deleteLike(req, res, next) {
    try {
      const { id } = req.params

      const likes = await Like.findByPk(id)
      if (!likes) {
        throw { status: 404, message: "Likes data not found"}
      } else if (likes.UserId != req.user.id) {
        throw { status: 403, message: "Not authorized" }
      }
      await Like.destroy({where: { id } })
      
      res.status(200).json({ message: "Like has been removed"})
    } catch (error) {
      next (error)
    }
  }
}

module.exports = likeControllers