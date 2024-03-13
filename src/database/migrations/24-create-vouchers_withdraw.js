/* eslint-disable max-lines-per-function */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vouchers_withdraw', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      voucher_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'establishments_products',
          key: 'product_id', 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      batch_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'batches',
          key: 'batch_id', 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      establishment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'establishments',
          key: 'id', 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      sold_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      expire_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      motive: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    }, {
      engine: 'InnoDB',
      charset: 'latin1',
      underscored: true,
      timestamps: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('vouchers_withdraw');
  },
};