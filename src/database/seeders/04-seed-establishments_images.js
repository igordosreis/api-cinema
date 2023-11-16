/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

module.exports = {
  up: async (QueryInterface) => {
    await QueryInterface.bulkInsert('establishment_images', [
      {
        establishmentId: 488,
        image: '488.png',
        cover: 'CAPACINEART11.png',
        resizeColor: '#ffffff',
      },
      {
        establishmentId: 753,
        image: 'clube753.jpg',
        cover: 'CINEMARKCAPA.png',
        resizeColor: '#ffffff',
      },
      {
        establishmentId: 1115,
        image: 'clubecinesystem.jpg',
        cover: 'categoria161.jpg',
        resizeColor: '#ffffff',
      },
      {
        establishmentId: 3091,
        image: 'ucicinema.jpg',
        cover: 'UCICAPA.png',
        resizeColor: '#ffffff',
      },
      {
        establishmentId: 3092,
        image: 'kinoplexcinema.jpg',
        cover: 'KINOPLEXCAPA1.png',
        resizeColor: '#ffffff',
      },
      {
        establishmentId: 3543,
        image: 'NovoLogoAzul.png',
        cover: 'categoria16.jpg',
        resizeColor: '#ffffff',
      },
      {
        establishmentId: 3564,
        image: 'MOVIECOMLOGO.png',
        cover: 'CAPAMoviecom.png',
        resizeColor: '#ffffff',
      },
      {
        establishmentId: 4243,
        image: 'Cine.jpg',
        cover: 'categoria16.jpg',
        resizeColor: '#ffffff',
      },
      {
        establishmentId: 4732,
        image: 'llogocineee.jpg',
        cover: 'cacinem.jpg',
        resizeColor: '#ffffff',
      },
      {
        establishmentId: 4762,
        image: 'logommmm.jpg',
        cover: '',
        resizeColor: '#ffffff',
      },
      {
        establishmentId: 5049,
        image: 'CineA.png',
        cover: 'cineacapaa.jpg',
        resizeColor: '#ffffff',
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('establishment_images', null, {});
  },
};