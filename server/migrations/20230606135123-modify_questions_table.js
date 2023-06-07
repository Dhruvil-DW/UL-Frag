'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('questions', 'description',{
      type: Sequelize.TEXT,
      after: 'parent_id',
    } )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('questions', 'description')
  }
};
