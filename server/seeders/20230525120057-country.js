'use strict';

/** @type {import('sequelize-cli').Migration} */
const countries = [
  {name:'United Kingdom'},
  {name:'France'},
  {name:'Turkey'},
  {name:'Netherlands'},
]
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('countries', countries);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('countries', null, {})
  }
};
