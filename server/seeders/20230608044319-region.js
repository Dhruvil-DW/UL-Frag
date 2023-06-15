'use strict';

/** @type {import('sequelize-cli').Migration} */
const regions = [
  {region_name: 'Africa'},
  {region_name: 'Americas'},
  {region_name: 'Europe'},
  {region_name: 'Indonesia'},
  {region_name: 'North Asia'},
  {region_name: 'SEAA'}, 
  {region_name: 'South Asia'},
]
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('regions', regions);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('regions', null,{});
  }
};
