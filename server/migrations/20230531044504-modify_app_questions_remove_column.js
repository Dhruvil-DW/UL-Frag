'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('app_questions', 'answer_id')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('app_questions', 'answer_id',{
      type: Sequelize.INTEGER,
      after: 'app_id',
    } )
  }
};
