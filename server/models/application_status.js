'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class application_status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Application);
    }
  }
  application_status.init({
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'application_status',
    underscored: true
  });
  return application_status;
};