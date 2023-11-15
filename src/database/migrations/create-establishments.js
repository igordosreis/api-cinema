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
        characterSet: 'utf8mb3',
      },
      primary_color: {
        type: Sequelize.STRING,
        defaultValue: '000000',
        allowNull: false,
        characterSet: 'utf8mb3',
        collate: 'utf8mb3_unicode_ci',
      },
      link: {
        type: Sequelize.TEXT('long'),
        collate: 'utf8mb3_unicode_ci',
      },
      link_description: {
        type: Sequelize.STRING(80),
        allowNull: false,
        collate: 'utf8mb3_unicode_ci',
      },
      telephone: {
        type: Sequelize.STRING(150),
        collate: 'utf8mb3_unicode_ci',
        defaultValue: null,
      },
      telephone_2: {
        type: Sequelize.STRING(150),
        collate: 'utf8mb3_unicode_ci',
        defaultValue: null,
      },
      whatsapp: {
        type: Sequelize.STRING(150),
        collate: 'utf8mb3_unicode_ci',
        defaultValue: null,
      },
      instagram: {
        type: Sequelize.STRING(150),
        collate: 'utf8mb3_unicode_ci',
        defaultValue: null,
      },
      site: {
        type: Sequelize.STRING(150),
        collate: 'utf8mb3_unicode_ci',
        defaultValue: null,
      },
      rules: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
        collate: 'utf8mb3_unicode_ci',
      },
      key_words: {
        type: Sequelize.TEXT,
        collate: 'utf8mb3_unicode_ci',
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      views: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
      under_highlight: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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