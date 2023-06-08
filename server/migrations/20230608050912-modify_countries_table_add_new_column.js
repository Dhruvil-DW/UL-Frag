'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('countries', 'region_id',{
      type: Sequelize.INTEGER,
      after: 'name',
    } )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('countries', 'region_id')
  }
};
