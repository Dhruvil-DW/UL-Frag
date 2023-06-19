'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        'answers',
        'answer',
        {
          type: Sequelize.STRING(1024),
        },
        { transaction }
      );
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        'answers',
        'answer',
        {
          type: Sequelize.STRING(255),
        },
        { transaction }
      );
    })
  }
};
