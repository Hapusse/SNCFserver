'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trajet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Trajet.belongsTo(models.Train, {
        foreignKey : {allowNull:false}
      });
      models.Trajet.belongsTo(models.Gare, {
        as:"idGAREDEPART",
        foreignKey : {allowNull:false}
      });
      models.Trajet.belongsTo(models.Gare, {
        as:"idGAREARRIVEE",
        foreignKey : {allowNull:false}
      });
      models.Trajet.hasMany(models.Billet);
      models.Trajet.hasMany(models.Repartition);

    }
  };
  Trajet.init({
    idGAREDEPART: DataTypes.INTEGER,
    idGAREARRIVEE: DataTypes.INTEGER,
    idTRAIN: DataTypes.INTEGER,
    heure_depart: DataTypes.DATE,
    heure_arrivee: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Trajet',
  });
  return Trajet;
};