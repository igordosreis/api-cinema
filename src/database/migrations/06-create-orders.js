/* eslint-disable max-lines-per-function */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'waiting',
      },
      expire_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      payment_id: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      total_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      total_units: {
        type: Sequelize.INTEGER,
        defaultValue: null,
      },
      total_consumables: {
        type: Sequelize.INTEGER,
        defaultValue: null,
      },
      total_tickets: {
        type: Sequelize.INTEGER,
        defaultValue: null,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      underscored: true,
      timestamps: false,
      engine: 'InnoDB',
      charset: 'latin1',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('orders');
  },
};
