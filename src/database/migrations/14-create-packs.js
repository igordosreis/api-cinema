/* eslint-disable max-lines-per-function */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('packs', {
      pack_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
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
      rules: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
        defaultValue: null,
        collate: 'utf8mb3_unicode_ci',
      },
      counter: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true,
      },
      counter_limit: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true,
      },
      limited: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      // category: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      //   defaultValue: 'pack',
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
    await queryInterface.dropTable('packs');
  },
};
