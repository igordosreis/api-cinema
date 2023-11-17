/* eslint-disable max-lines-per-function */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tickets_logs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      request: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      response: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ticket_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tickets_used',
          key: 'id', 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      date: {
        type: Sequelize.DATE,
        defaultValue: null,
      },
    }, {
      underscored: true,
      timestamps: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('tickets_logs');
  },
};
