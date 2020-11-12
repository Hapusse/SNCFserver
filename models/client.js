'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Client.belongsTo(models.Reduction, {
        foreignKey : {allowNull:false}
      });
      models.Client.hasMany(models.Billet);
    }
  };
  Client.init({
    idREDUCTION: DataTypes.INTEGER,
    prenom: DataTypes.STRING,
    nom: DataTypes.STRING,
    date_naissance: DataTypes.DATEONLY,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    majeur: DataTypes.BOOLEAN,
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Client',
  });
  return Client;
};