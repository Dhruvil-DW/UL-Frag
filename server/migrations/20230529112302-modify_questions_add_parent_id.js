'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'questions', //table name
        'parent_id', //new column name
        {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          after: 'status',
        }  
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('questions', 'parent_id')
    ])
  }
};
