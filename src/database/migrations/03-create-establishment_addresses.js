/* eslint-disable max-lines-per-function */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('establishments_addresses', {
      id: {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        collate: 'utf8mb3_unicode_ci',
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        collate: 'utf8mb3_unicode_ci',
        characterSet: 'utf8mb3',
      },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cities', 
          key: 'id', 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      latitude: {
        type: Sequelize.TEXT,
        allowNull: false,
        collate: 'utf8mb3_unicode_ci',
      },
      longitude: {
        type: Sequelize.TEXT,
        allowNull: false,
        collate: 'utf8mb3_unicode_ci',
      },
      telephone: {
        type: Sequelize.STRING(40),
        allowNull: true,
        collate: 'utf8mb3_unicode_ci',
      },
      code: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    }, {
      underscored: true,
      timestamps: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('establishments_addresses');
  },
};
