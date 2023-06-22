'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'questions',
      'question_opt',
      {
        type: Sequelize.STRING(1024),
      },
      
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'questions',
      'question_opt',
      {
        type: Sequelize.STRING(255),
      },
    );
  }
};
