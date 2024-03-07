/* eslint-disable max-lines-per-function */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('establishments_products', {
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      purchasable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        collate: 'utf8mb3_unicode_ci',
      },
      description: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
        defaultValue: null,
        collate: 'utf8mb3_unicode_ci',
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      original_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      rules: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
        defaultValue: null,
        collate: 'utf8mb3_unicode_ci',
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products_types',
          key: 'id', 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      sold_out_amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      // category: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      //   defaultValue: 'product',
      // },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      expire_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
    }, {
      underscored: true,
      timestamps: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('establishments_products');
  },
};
