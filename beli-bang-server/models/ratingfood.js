'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RatingFood extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RatingFood.belongsTo(models.User)
      RatingFood.belongsTo(models.Food)
    }
  }
  RatingFood.init({
    UserId: DataTypes.INTEGER,
    FoodId: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'RatingFood',
  });
  return RatingFood;
};