/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

module.exports = {
  up: async (QueryInterface) => {
    await QueryInterface.bulkInsert('establishments_images', [
      {
        establishment_id: 488,
        logo: 'logo_cineart.png',
        cover: 'cover_cineart.png',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 753,
        logo: 'logo_cinemark.png',
        cover: 'cover_cinemark.png',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 1115,
        logo: 'logo_cinesystem.png',
        cover: 'cover_cinesystem.png',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 3091,
        logo: 'logo_uci.png',
        cover: 'cover_uci.png',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 3092,
        logo: 'logo_kinoplex.png',
        cover: 'cover_kinoplex.png',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 3543,
        logo: null,
        cover: null,
        resize_color: '#ffffff',
      },
      {
        establishment_id: 3564,
        logo: 'logo_moviecom.png',
        cover: 'cover_moviecom.png',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 4243,
        logo: null,
        cover: null,
        resize_color: '#ffffff',
      },
      {
        establishment_id: 4732,
        logo: null,
        cover: null,
        resize_color: '#ffffff',
      },
      {
        establishment_id: 4762,
        logo: null,
        cover: null,
        resize_color: '#ffffff',
      },
      {
        establishment_id: 5049,
        logo: 'logo_cinea.png',
        cover: 'cover_cinea.png',
        resize_color: '#ffffff',
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('establishments_images', null, {});
  },
};