'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User)
      Order.belongsTo(models.Store)
    }
  }
  Order.init({
    StoreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Store ID is required",
        },
        notNull: {
          msg: "Store ID is required",
        },
      },
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "User ID is required",
        },
        notNull: {
          msg: "User ID is required",
        },
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Waiting"
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};