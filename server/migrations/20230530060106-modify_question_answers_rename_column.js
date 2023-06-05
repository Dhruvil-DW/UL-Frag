'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn("question_answers", 'user_id', 'app_id')
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('question_answers', 'app_id', 'user_id')
    ])
  }
};
