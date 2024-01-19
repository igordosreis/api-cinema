/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

module.exports = {
  up: async (QueryInterface) => {
    await QueryInterface.bulkInsert('establishments_images', [
      {
        establishment_id: 488,
        image: 'logo_cineart.png',
        cover: 'cover_cineart.png',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 753,
        image: 'logo_cinemark.jpg',
        cover: 'cover_cinemark.png',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 1115,
        image: 'logo_cinesystem.jpg',
        cover: 'cover_cinesystem.jpg',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 3091,
        image: 'logo_uci.jpg',
        cover: 'cover_uci.png',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 3092,
        image: 'logo_kinoplex.jpg',
        cover: 'cover_kinoplex.png',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 3543,
        image: null,
        cover: null,
        resize_color: '#ffffff',
      },
      {
        establishment_id: 3564,
        image: 'logo_moviecom.png',
        cover: 'cover_moviecom.png',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 4243,
        image: null,
        cover: null,
        resize_color: '#ffffff',
      },
      {
        establishment_id: 4732,
        image: null,
        cover: null,
        resize_color: '#ffffff',
      },
      {
        establishment_id: 4762,
        image: null,
        cover: null,
        resize_color: '#ffffff',
      },
      {
        establishment_id: 5049,
        image: 'logo_cinea.png',
        cover: 'cover_cinea.jpg',
        resize_color: '#ffffff',
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('establishments_images', null, {});
  },
};