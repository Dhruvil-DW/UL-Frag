'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.category, { foreignKey: 'category_id' });
      this.hasMany(models.answers);
      this.hasMany(models.app_question);
      this.belongsToMany(models.Application, {
        through: models.app_question,
        foreignKey: 'question_id'
      })
    }
  }
  question.init({
    category_id: DataTypes.INTEGER,
    country_id: DataTypes.INTEGER,
    question_type_id: DataTypes.INTEGER,
    question: DataTypes.STRING,
    question_opt: DataTypes.STRING,
    require: DataTypes.BOOLEAN,
    status: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'question',
    underscored: true
  });
  return question;
};