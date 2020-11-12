'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reduction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Reduction.hasMany(models.Client);
    }
  };
  Reduction.init({
    nom: DataTypes.STRING,
    pourcentage: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reduction',
  });
  return Reduction;
};