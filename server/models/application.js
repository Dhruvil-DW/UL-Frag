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
      this.belongsToMany(models.question, {
        through:models.app_question,
        foreignKey:'app_id'
      });
    }
  }
  Application.init({
    project_name: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    application_status_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Application',
  });
  return Application;
};