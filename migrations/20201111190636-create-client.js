'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Clients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idREDUCTION: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model:'Reductions',
          key:'id'
        }
      },
      prenom: {
        allowNull: true,
        type: Sequelize.STRING
      },
      nom: {
        allowNull: true,
        type: Sequelize.STRING
      },
      date_naissance: {
        allowNull: true,
        type: Sequelize.DATEONLY
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      majeur: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      isAdmin: {
        allowNull: false,
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Clients');
  }
};