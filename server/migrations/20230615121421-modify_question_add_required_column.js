'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('questions', 'require', { type: Sequelize.BOOLEAN, after: 'question_opt', allowNull: false, defaultValue: false });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('questions', 'require');
  }
};
