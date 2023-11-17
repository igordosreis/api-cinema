/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

module.exports = {
  up: async (QueryInterface) => {
    await QueryInterface.bulkInsert('establishment_images', [
      {
        establishment_id: 488,
        image: '488.png',
        cover: 'CAPACINEART11.png',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 753,
        image: 'clube753.jpg',
        cover: 'CINEMARKCAPA.png',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 1115,
        image: 'clubecinesystem.jpg',
        cover: 'categoria161.jpg',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 3091,
        image: 'ucicinema.jpg',
        cover: 'UCICAPA.png',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 3092,
        image: 'kinoplexcinema.jpg',
        cover: 'KINOPLEXCAPA1.png',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 3543,
        image: 'NovoLogoAzul.png',
        cover: 'categoria16.jpg',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 3564,
        image: 'MOVIECOMLOGO.png',
        cover: 'CAPAMoviecom.png',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 4243,
        image: 'Cine.jpg',
        cover: 'categoria16.jpg',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 4732,
        image: 'llogocineee.jpg',
        cover: 'cacinem.jpg',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 4762,
        image: 'logommmm.jpg',
        cover: '',
        resize_color: '#ffffff',
      },
      {
        establishment_id: 5049,
        image: 'CineA.png',
        cover: 'cineacapaa.jpg',
        resize_color: '#ffffff',
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('establishment_images', null, {});
  },
};