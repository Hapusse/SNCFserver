'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Trajets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idGAREDEPART: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model:'Gares',
          key:'id'
        }
      },
      idGAREARRIVEE: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model:'Gares',
          key:'id'
        }
      },
      idTRAIN: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model:'Trains',
          key:'id'
        }
      },
      heure_depart: {
        allowNull: false,
        type: Sequelize.DATE
      },
      heure_arrivee: {
        allowNull: false,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Trajets');
  }
};