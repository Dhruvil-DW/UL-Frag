'use strict';

/** @type {import('sequelize-cli').Migration} */
const categories = [
  {name: 'Overview'},
  {name: 'Section 1'},
  {name: 'Section 2'},
  {name: 'Section 3'}
]
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('categories', categories);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('categories', null,{});
  }
};
