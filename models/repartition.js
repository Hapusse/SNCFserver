'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Repartition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Repartition.hasMany(models.Trajet);
      models.Repartition.hasMany(models.Voiture);
    }
  };
  Repartition.init({
    idTRAJET: DataTypes.INTEGER,
    idVOITURE: DataTypes.INTEGER,
    positionDansTrain: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Repartition',
  });
  return Repartition;
};