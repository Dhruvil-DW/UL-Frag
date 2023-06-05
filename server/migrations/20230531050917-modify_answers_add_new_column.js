'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('answers', 'app_question_id',{
      type: Sequelize.INTEGER,
      after: 'answer',
    } )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('answers', 'app_question_id')
  }
};
