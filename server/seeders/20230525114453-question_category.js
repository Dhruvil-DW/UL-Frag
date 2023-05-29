'use strict';

/** @type {import('sequelize-cli').Migration} */
const categories = [
  {name: 'Overview'},
  {name: 'Marketing'}
]
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('categories', categories);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('categories', null,{});
  }
};
