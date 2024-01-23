'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Food', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      imageUrl: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      price: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      StoreId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Stores",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Food');
  }
};