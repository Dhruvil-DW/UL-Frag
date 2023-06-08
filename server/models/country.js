'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     this.belongsTo(models.region, {foreignKey:'region_id'});
    }
  }
  country.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'country',
    underscored: true
  });
  return country;
};