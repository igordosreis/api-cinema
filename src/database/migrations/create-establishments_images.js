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
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('establishment_images');
  },
};