/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

module.exports = {
  up: async (QueryInterface) => {
    await QueryInterface.bulkInsert('tags_products', [
      {
        tag_id: 1,
        product_id: 1,
      },
      {
        tag_id: 3,
        product_id: 1,
      },
      {
        tag_id: 1,
        product_id: 2,
      },
      {
        tag_id: 4,
        product_id: 2,
      },
      {
        tag_id: 2,
        product_id: 3,
      },
      {
        tag_id: 4,
        product_id: 3,
      },
      {
        tag_id: 12,
        product_id: 4,
      },
      {
        tag_id: 12,
        product_id: 5,
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('tags_products', null, {});
  },
};