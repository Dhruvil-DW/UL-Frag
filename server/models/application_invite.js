'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class application_invite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  application_invite.init({
    app_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'application_invite',
  });
  return application_invite;
};