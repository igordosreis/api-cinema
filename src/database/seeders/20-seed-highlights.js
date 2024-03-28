/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

module.exports = {
  up: async (QueryInterface) => {
    await QueryInterface.bulkInsert('highlights', [
      {
        position: 1,
        addressId: 2702,
        establishmentId: 488,
        cityId: 1,
      },
      {
        position: 2,
        addressId: 2753,
        establishmentId: 753,
        cityId: 1,
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('highlights', null, {});
  },
};