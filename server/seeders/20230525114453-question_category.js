'use strict';

/** @type {import('sequelize-cli').Migration} */
const categories = [
  {name: 'Overview'},
  {name: 'About the Fragrance'}, // Section:1
  {name: 'About the Consumers'}, // Section:2
  {name: 'About the Investment'} // Section:3
]
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('categories', categories);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('categories', null,{});
  }
};
