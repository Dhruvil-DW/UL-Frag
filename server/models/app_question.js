'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class app_question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  app_question.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    question_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'question',
        key: 'question_id'
      }
    },
    app_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Application',
        key: 'app_id'
      }
    },
  }, {
    sequelize,
    modelName: 'app_question',
  });
  return app_question;
};