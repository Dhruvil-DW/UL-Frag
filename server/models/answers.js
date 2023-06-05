'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class answers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.question, {foreignKey: 'question_id'});
      this.belongsTo(models.app_question, {foreignKey: 'app_question_id'});
    }
  }
  answers.init({
    question_id: DataTypes.INTEGER,
    answer:DataTypes.STRING,
    app_question_id:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'answers',
  });
  return answers;
};