'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Store.belongsTo(models.User)
      Store.hasMany(models.Food)
      Store.hasMany(models.Order)
      Store.hasMany(models.Like)
      Store.hasMany(models.RatingStore)
    }
  }
  Store.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name is required",
        },
        notNull: {
          msg: "Name is required",
        },
      },
    },
    status: DataTypes.BOOLEAN,
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Image is required",
        },
        notNull: {
          msg: "Image is required",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description is required",
        },
        notNull: {
          msg: "Description is required",
        },
      },
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Store',
  });
  return Store;
};