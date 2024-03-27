/* eslint-disable max-lines-per-function */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('highlights', {
      position: {
        field: 'position',
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: false,
      },
      address_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: false,
        references: {
          model: 'establishments_addresses',
          key: 'id', 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
