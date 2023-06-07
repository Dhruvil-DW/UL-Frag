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
      this.belongsTo(models.Application);
      this.belongsTo(models.User);
    }
  }
  application_invite.init({
    app_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Application',
        key: 'app_id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'user_id'
      }
    },
  }, {
    sequelize,
    modelName: 'application_invite',
    underscored: true
  });
  return application_invite;
};