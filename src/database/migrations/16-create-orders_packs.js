/* eslint-disable max-lines-per-function */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders_packs', {
      order_id: {
        field: 'order_id',
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: false,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      pack_id: {
        field: 'pack_id',
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: false,
        allowNull: false,
        references: {
          model: 'packs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sold_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
    }, {
      underscored: true,
      timestamps: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('orders_packs');
  },
};
