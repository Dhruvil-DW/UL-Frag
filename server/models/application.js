'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'user_id'});
      this.belongsTo(models.application_status, {foreignKey:'application_status_id'});
      this.hasMany(models.application_invite, {foreignKey: "app_id"});
      this.belongsToMany(models.question, {
        through:models.app_question,
        foreignKey:'app_id'
      });
      this.hasMany(models.app_question, {foreignKey:'app_id'});
      this.belongsToMany(models.User,{
        through: models.application_invite,
        foreignKey: 'app_id'
      }
      );
    }
  }
  Application.init({
    project_name: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    last_edit_by: DataTypes.INTEGER,
    last_edit_time: DataTypes.DATE,
    status: DataTypes.INTEGER,
    application_status_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Application',
    underscored: true
  });
  return Application;
};