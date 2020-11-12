'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Repartitions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idTRAJET: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model:"Trajets",
          key:"id"
        }
      },
      idVOITURE: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model:"Voitures",
          key:"id"
        }
      },
      positionDansTrain: {
        allowNull: false,
        type: Sequelize.INTEGER
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Repartitions');
  }
};