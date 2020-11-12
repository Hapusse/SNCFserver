'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Billets', {
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
      idPLACE: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model:"Places",
          key:"id"
        }
      },
      idCLIENT: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model:"Clients",
          key:"id"
        }
      },
      prix_billet_initial: {
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
    await queryInterface.dropTable('Billets');
  }
};