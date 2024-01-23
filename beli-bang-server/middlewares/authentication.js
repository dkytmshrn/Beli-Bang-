const { verifyToken } = require("../helpers/jwt")
const { User } = require('../models')

async function authentication(req, res, next) {
  try {
    const payload = verifyToken(req.headers.access_token)

    const user = await User.findByPk(payload.id)
    if (!user) {
      throw { status: 401, message: "Invalid token" };
    }
    req.user = { id: user.id, role: user.role}
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = authentication