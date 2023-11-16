/* eslint-disable max-lines-per-function */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tickets_logs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      request: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      response: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      ticket: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      date: {
        type: Sequelize.DATE,
        defaultValue: null,
      },
    }, {
      underscored: true,
      timestamps: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('tickets_logs');
  },
};
