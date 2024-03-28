/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

module.exports = {
  up: async (QueryInterface) => {
    await QueryInterface.bulkInsert('highlights', [
      {
        position: 1,
        address_id: 2702,
        establishment_id: 488,
        city_id: 1,
      },
      {
        position: 2,
        address_id: 2753,
        establishment_id: 753,
        city_id: 1,
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('highlights', null, {});
  },
};