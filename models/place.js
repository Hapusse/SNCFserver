'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Place extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Place.hasMany(models.Billet);
      models.Place.belongsTo(models.Voiture, {
        foreignKey : {allowNull:false}
      });
    }
  };
  Place.init({
    idVOITURE: DataTypes.INTEGER,
    numero_place: DataTypes.STRING,
    cote_couloir: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Place',
  });
  return Place;
};