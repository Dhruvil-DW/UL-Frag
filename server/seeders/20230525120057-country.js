'use strict';

/** @type {import('sequelize-cli').Migration} */
const countries = [
  { name: 'Argentina', region_id: 2 },
  { name: 'Australia', region_id: 3 },
  { name: 'Brazil', region_id: 2 },
  { name: 'Bangladesh', region_id: 7 },
  { name: 'China', region_id: 5 },
  { name: 'France', region_id: 3 },
  { name: 'India', region_id: 7 },
  { name: 'Indonesia', region_id: 4 },
  { name: 'Italy', region_id: 3 },
  { name: 'Netherlands', region_id: 3 },
  { name: 'Pakistan', region_id: 7 },
  { name: 'Philippines', region_id: 6 },
  { name: 'Poland', region_id: 3 },
  { name: 'South Africa', region_id: 1 },
  { name: 'Thailand', region_id: 6 },
  { name: 'Turkey', region_id: 3 },
  { name: 'United Kingdom', region_id: 3 },
  { name: 'Vietnam', region_id: 6 },
]
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('countries', countries);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('countries', null, {})
  }
};
