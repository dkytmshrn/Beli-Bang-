const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const imageKit = require("../middlewares/imageKit");
const { signToken } = require("../helpers/jwt");
const { User, Sequelize } = require("../models");
const redis = require("../helpers/redis");

class userControllers {
  static async register(req, res, next) {
    try {
      const { username, email, password, role, phoneNumber, address } = req.body;

      const user = await User.create({
        username,
        email,
        password,
        role,
        phoneNumber,
        address,
      });
      const access_token = signToken({ id: user.id, email: user.email });

      res.status(201).json({ access_token, role: user.role, id: user.id });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password, expoPushToken: tokenNotification } = req.body;
      if (!email) {
        throw { status: 400, message: "Email is required" };
      }
      if (!password) {
        throw { status: 400, message: "Password is required" };
      }

      const user = await User.findOne({
        where: { email },
      });
      if (!user || !comparePassword(password, user.password)) {
        throw { status: 401, message: "Invalid email/password" };
      }

      const access_token = signToken({ id: user.id, email: user.email });

      //set redis
      const tokenCache = await redis.get(`tokens:notification:${user.id}`);

      if (!tokenCache) {
        await redis.set(
          `tokens:notification:${user.id}`,
          JSON.stringify(tokenNotification)
        );
      }

      res
        .status(200)
        .json({ access_token, username: user.username, role: user.role, id: user.id });
    } catch (error) {
      next(error);
    }
  }

  static async fetchById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (!user) {
        throw { status: 404, message: "User Not Found" };
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async editUsername(req, res, next) {
    try {
      const { username } = req.body;
      const id = req.user.id;

      await User.update({ username }, { where: { id } });

      res.status(200).json({ message: "Success Edit Username" });
    } catch (error) {
      next(error);
    }
  }

  static async editPassword(req, res, next) {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const id = req.user.id;

      if (!oldPassword) {
        throw { status: 400, message: "Password is required" };
      }

      if (!newPassword) {
        throw { status: 400, message: "Password is required" };
      }

      if (oldPassword == newPassword) {
        throw { status: 401, message: "Cannot use the old password" };
      }

      if (newPassword !== confirmPassword) {
        throw { status: 400, message: "Password does not match" };
      }

      const user = await User.findByPk(id);

      if (!comparePassword(oldPassword, user.password)) {
        throw { status: 401, message: "Invalid password" };
      }

      await User.update({ password: newPassword }, { where: { id } });

      res.status(200).json({ message: "Success Edit Password" });
    } catch (error) {
      next(error);
    }
  }

  static async editPhoneNumber(req, res, next) {
    try {
      const { phoneNumber } = req.body;
      const id = req.user.id;

      await User.update({ phoneNumber }, { where: { id } });

      res.status(200).json({ message: "Success Edit Phone Number" });
    } catch (error) {
      next(error);
    }
  }

  static async editAddress(req, res, next) {
    try {
      const { address } = req.body;
      const id = req.user.id;

      await User.update({ address }, { where: { id } });

      res.status(200).json({ message: "Success Edit Address" });
    } catch (error) {
      next(error);
    }
  }

  static async editProfilePicture(req, res, next) {
    try {
      const id = req.user.id;
      const { imgUrl: profilePicture } = req.body;

      await User.update({ profilePicture }, { where: { id } });

      res.status(200).json({ message: "Success Edit Profile Picture" });
    } catch (error) {
      next(error);
    }
  }

  static async editlocation(req, res, next) {
    try {
      const { longitude, latitude } = req.body;
      const id = req.user.id;

      if (!longitude || !latitude) {
        throw { status: 400, message: "Location is required" };
      }

      const location = await Sequelize.fn(
        "ST_GeomFromText",
        `POINT(${longitude} ${latitude})`
      );

      await User.update({ location }, { where: { id } });

      res.status(200).json({ message: "Success Edit Location" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = userControllers;
