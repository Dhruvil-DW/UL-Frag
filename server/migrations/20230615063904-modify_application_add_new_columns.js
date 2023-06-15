'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('applications', 'last_edit_by', { type: Sequelize.INTEGER, after: 'user_id', });
    await queryInterface.addColumn('applications', 'last_edit_time', { type: Sequelize.DATE, after: 'last_edit_by', });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('applications', 'last_edit_by');
    await queryInterface.removeColumn('applications', 'last_edit_time');
  }
};
