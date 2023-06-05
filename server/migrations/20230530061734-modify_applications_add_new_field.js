'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("applications", 'application_status_id',
      {
        type: Sequelize.INTEGER,
        after: 'project_name',
      }  
      ),
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn("applications", "application_status_id")
    ])
  }
};
