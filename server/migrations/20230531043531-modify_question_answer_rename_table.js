'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameTable('question_answers', 'app_questions');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable('app_questions', 'question_answers');
  }
};
