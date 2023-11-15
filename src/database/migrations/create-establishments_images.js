/* eslint-disable max-lines-per-function */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('establishment_images', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      image: {
        type: Sequelize.STRING(255),
        defaultValue: null,
      },
      image_carousel: {
        type: Sequelize.STRING(255),
        defaultValue: null,
      },
      cover: {
        type: Sequelize.STRING(120),
        defaultValue: null,
      },
      resize_color: {
        type: Sequelize.STRING(255),
        defaultValue: '#ffffff',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('establishment_images');
  },
};