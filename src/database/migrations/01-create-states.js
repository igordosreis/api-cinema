/* eslint-disable max-lines-per-function */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('states', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      abbreviation: {
        type: Sequelize.STRING(2),
        defaultValue: null,
      },
    }, {
      underscored: true,
      timestamps: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('states');
  },
};