/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines-per-function */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('establishments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        collate: 'utf8mb3_unicode_ci',
      },
      about: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
        collate: 'utf8mb3_unicode_ci',
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: true,
        collate: 'utf8mb3_unicode_ci',
      },
      primary_color: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '000000',
        collate: 'utf8mb3_unicode_ci',
      },
      link: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
        collate: 'utf8mb3_unicode_ci',
      },
      link_description: {
        type: Sequelize.STRING,
        allowNull: true,
        collate: 'utf8mb3_unicode_ci',
      },
    }, {
      underscored: true,
      timestamps: false,
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('establishments');
  },
};