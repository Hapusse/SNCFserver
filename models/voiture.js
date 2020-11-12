'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voiture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Voiture.hasMany(models.Place);
      models.Voiture.hasMany(models.Repartition);
    }
  };
  Voiture.init({
    nb_places: DataTypes.INTEGER,
    classe_voiture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Voiture',
  });
  return Voiture;
};