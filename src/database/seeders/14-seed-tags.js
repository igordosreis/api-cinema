/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

module.exports = {
  up: async (QueryInterface) => {
    await QueryInterface.bulkInsert('tags', [
      {
        name: '2D',
      },
      {
        name: '3D',
      },
      {
        name: 'Segunda à Quinta',
      },
      {
        name: 'Final de semana',
      },
      {
        name: 'Feriado',
      },
      {
        name: 'IMAX',
      },
      {
        name: 'Cinemark 4D',
      },
      {
        name: 'Cadeira Especial',
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('tags', null, {});
  },
};