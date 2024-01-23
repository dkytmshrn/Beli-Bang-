'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Store)
      User.hasMany(models.Order)
      User.hasMany(models.Like)
      User.hasMany(models.RatingFood)
      User.hasMany(models.RatingStore)
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Username is required",
        },
        notNull: {
          msg: "Username is required",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email must be unique",
      },
      validate: {
        notEmpty: {
          msg: "Email is required",
        },
        notNull: {
          msg: "Email is required",
        },
        isEmail: {
          msg: "Invalid email format",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password is required",
        },
        notNull: {
          msg: "Password is required",
        },
        len: {
          args: [5],
          msg: "Minimum password is 5 characters",
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Role is required",
        },
        notNull: {
          msg: "Role is required",
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Phone Number is required",
        },
        notNull: {
          msg: "Phone Number is required",
        },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Address is required",
        },
        notNull: {
          msg: "Address is required",
        },
      },
    },
    profilePicture: {
      type: DataTypes.TEXT,
      defaultValue: "https://www.mmm.ucar.edu/sites/default/files/img/default-avatar.jpg"
    },
    location: DataTypes.GEOMETRY('POINT'),
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((instance) => {
    instance.password = hashPassword(instance.password)
  })

  User.beforeUpdate((instance) => {
    instance.password = hashPassword(instance.password)
  })

  return User;
};