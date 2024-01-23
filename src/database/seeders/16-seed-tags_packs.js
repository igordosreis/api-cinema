/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

module.exports = {
  up: async (QueryInterface) => {
    await QueryInterface.bulkInsert('tags_packs', [
      {
        tag_id: 1,
        pack_id: 1,
      },
      {
        tag_id: 3,
        pack_id: 1,
      },
      {
        tag_id: 2,
        pack_id: 3,
      },
      {
        tag_id: 4,
        pack_id: 3,
      },
      {
        tag_id: 6,
        pack_id: 4,
      },
      {
        tag_id: 4,
        pack_id: 4,
      },
      {
        tag_id: 2,
        pack_id: 2,
      },
      {
        tag_id: 4,
        pack_id: 2,
      },
      {
        tag_id: 8,
        pack_id: 2,
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('tags_packs', null, {});
  },
};