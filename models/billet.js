'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Billet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Billet.belongsTo(models.Client, {
        foreignKey : {allowNull:false}
      });
      models.Billet.belongsTo(models.Place, {
        foreignKey : {allowNull:false}
      });
      models.Billet.belongsTo(models.Trajet, {
        foreignKey : {allowNull:false}
      });
    }
  };
  Billet.init({
    idTRAJET: DataTypes.INTEGER,
    idPLACE: DataTypes.INTEGER,
    idCLIENT: DataTypes.INTEGER,
    prix_billet_initial: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Billet',
  });
  return Billet;
};