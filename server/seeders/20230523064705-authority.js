'use strict';

/** @type {import('sequelize-cli').Migration} */
const authority = [
  {
    unique_id: "frag_au_1",
    role_id: 2,
    first_name: "Authority",
    last_name: "Test",
    email: "web@kypsa.in",
  }
]
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', authority);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', null,{});
  }
};
