'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Food extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Food.belongsTo(models.Store)
      Food.hasMany(models.RatingFood)
    }
  }
  Food.init({
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
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Price is required",
        },
        notNull: {
          msg: "Price is required",
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
    StoreId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Food',
  });
  return Food;
};