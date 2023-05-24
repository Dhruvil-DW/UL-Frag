'use strict';

/** @type {import('sequelize-cli').Migration} */

const userRoles = [
  { role: "User" },
  { role: "Authority" },
];

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user_roles', userRoles);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user_roles', null, {});
  }
};
