/* eslint-disable max-lines-per-function */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('establishments_images', {
      establishment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'establishments',
          key: 'id', 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      image: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      image_carousel: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      cover: {
        type: Sequelize.STRING(120),
        defaultValue: null,
      },
      resize_color: {
        type: Sequelize.STRING,
        defaultValue: '#ffffff',
      },
    }, {
      underscored: true,
      timestamps: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('establishments_images');
  },
};