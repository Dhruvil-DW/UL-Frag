'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Application);
      this.belongsToMany(models.Application,{
        through: models.application_invite,
        foreignKey: 'user_id'
      }
      );
    }
  }
  User.init({
    unique_id: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    contact_no:DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    token: DataTypes.STRING,
    otp: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    underscored: true
  });
  return User;
};