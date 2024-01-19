/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines-per-function */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tags_establishments', {
      tag_id: {
        field: 'tag_id',
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: false,
        allowNull: false,
        references: {
          model: 'tags',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      establishment_id: {
        field: 'establishment_id',
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: false,
        allowNull: false,
        references: {
          model: 'establishments',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    }, {
      underscored: true,
      timestamps: false,
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('tags_establishments');
  },
};