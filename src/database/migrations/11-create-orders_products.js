/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines-per-function */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders_products', {
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
      product_id: {
        field: 'product_id',
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: false,
        allowNull: false,
        references: {
          model: 'establishments_products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      soldPrice: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    }, {
      underscored: true,
      timestamps: false,
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('orders_products');
  },
};