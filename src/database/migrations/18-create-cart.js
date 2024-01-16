/* eslint-disable max-lines-per-function */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cart', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        field: 'user_id',
        type: Sequelize.INTEGER,
        allowNull: false,
        // primaryKey: true,
        // unique: false,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // primaryKey: true,
        defaultValue: false,
        references: {
          model: 'establishments_products',
          key: 'id', 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      pack_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // primaryKey: true,
        defaultValue: false,
        references: {
          model: 'packs',
          key: 'id', 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    }, {
      underscored: true,
      timestamps: false,
      engine: 'InnoDB',
      charset: 'latin1',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('cart');
  },
};