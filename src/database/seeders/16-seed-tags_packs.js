/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

module.exports = {
  up: async (QueryInterface) => {
    await QueryInterface.bulkInsert('tags_packs', [
      {
        tag_id: 0,
        product_id: 1,
      },
      {
        tag_id: 2,
        product_id: 1,
      },
      {
        tag_id: 1,
        product_id: 3,
      },
      {
        tag_id: 3,
        product_id: 3,
      },
      {
        tag_id: 5,
        product_id: 4,
      },
      {
        tag_id: 3,
        product_id: 4,
      },
      {
        tag_id: 1,
        product_id: 2,
      },
      {
        tag_id: 3,
        product_id: 2,
      },
      {
        tag_id: 7,
        product_id: 2,
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('tags_packs', null, {});
  },
};