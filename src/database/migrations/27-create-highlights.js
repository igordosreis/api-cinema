/* eslint-disable max-lines-per-function */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('highlights', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      address_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'establishments_addresses',
          key: 'id', 
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
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    }, {
      underscored: true,
      timestamps: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('highlights');
  },
};
