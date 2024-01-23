/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

module.exports = {
  up: async (QueryInterface) => {
    await QueryInterface.bulkInsert('tags_products', [
      {
        tag_id: 1,
        product_id: 48,
      },
      {
        tag_id: 3,
        product_id: 48,
      },
      {
        tag_id: 2,
        product_id: 49,
      },
      {
        tag_id: 3,
        product_id: 49,
      },
      {
        tag_id: 2,
        product_id: 47,
      },
      {
        tag_id: 4,
        product_id: 47,
      },
      {
        tag_id: 6,
        product_id: 46,
      },
      {
        tag_id: 4,
        product_id: 46,
      },
      {
        tag_id: 2,
        product_id: 45,
      },
      {
        tag_id: 4,
        product_id: 45,
      },
      {
        tag_id: 8,
        product_id: 47,
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('tags_products', null, {});
  },
};