'use strict';
const {
  Model, DatabaseError
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RatingStore extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RatingStore.belongsTo(models.User)
      RatingStore.belongsTo(models.Store)
    }
  }
  RatingStore.init({
    StoreId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'RatingStore',
  });
  return RatingStore;
};