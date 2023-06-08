'use strict';

/** @type {import('sequelize-cli').Migration} */
const regions = [
  {region_name: 'LATAM'},
  {region_name: 'SEAA'}, 
  {region_name: 'EUROPE'},
]
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('regions', regions);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('regions', null,{});
  }
};
