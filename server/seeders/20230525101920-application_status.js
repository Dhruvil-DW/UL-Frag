'use strict';

/** @type {import('sequelize-cli').Migration} */

const application_status = [
  { status: "Draft" },
  { status: "Pending" },
  { status: "Approved" },
  { status: "Rejected" },
];
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('application_statuses', application_status);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('application_statuses', null, {});
  }
};
