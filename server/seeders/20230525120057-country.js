'use strict';

/** @type {import('sequelize-cli').Migration} */
const countries = [
  { name: 'Argentina', region_id: 1 },
  { name: 'Brazil', region_id: 1 },
  { name: 'Colombia', region_id: 1 },
  { name: 'India', region_id: 2 },
  { name: 'Singapore', region_id: 2 },
  { name: 'Malaysia', region_id: 2 },
  { name: 'France', region_id: 3 },
  { name: 'Netherlands', region_id: 3 },
  { name: 'Turkey', region_id: 3 },
  { name: 'United Kingdom', region_id: 3 },
]
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('countries', countries);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('countries', null, {})
  }
};
