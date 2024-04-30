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
      {
        position: 3,
        address_id: 7686,
        establishment_id: 3091,
        city_id: 6,
      },
      {
        position: 4,
        address_id: 2702,
        establishment_id: 488,
        city_id: 1,
      },
      {
        position: 5,
        address_id: 2753,
        establishment_id: 753,
        city_id: 1,
      },
      {
        position: 6,
        address_id: 2828,
        establishment_id: 1115,
        city_id: 81,
      },
      {
        position: 7,
        address_id: 7648,
        establishment_id: 3092,
        city_id: 93,
      },
      {
        position: 8,
        address_id: 12543,
        establishment_id: 3543,
        city_id: 51,
      },
      {
        position: 9,
        address_id: 12626,
        establishment_id: 3564,
        city_id: 56,
      },
      {
        position: 10,
        address_id: 16052,
        establishment_id: 4243,
        city_id: 121,
      },
      {
        position: 11,
        address_id: 36872,
        establishment_id: 4732,
        city_id: 74,
      },
      {
        position: 12,
        address_id: 36955,
        establishment_id: 4762,
        city_id: 183,
      },
      {
        position: 13,
        address_id: 37778,
        establishment_id: 5049,
        city_id: 191,
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('highlights', null, {});
  },
};