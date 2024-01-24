/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

module.exports = {
  up: async (QueryInterface) => {
    await QueryInterface.bulkInsert('tags_types', [
      {
        tag_id: 1,
        type_id: 1,
      },
      {
        tag_id: 2,
        type_id: 1,
      },
      {
        tag_id: 3,
        type_id: 1,
      },
      {
        tag_id: 4,
        type_id: 1,
      },
      {
        tag_id: 5,
        type_id: 1,
      },
      {
        tag_id: 6,
        type_id: 1,
      },
      {
        tag_id: 7,
        type_id: 1,
      },
      {
        tag_id: 8,
        type_id: 1,
      },
      {
        tag_id: 9,
        type_id: 2,
      },
      {
        tag_id: 10,
        type_id: 2,
      },
      {
        tag_id: 11,
        type_id: 2,
      },
      {
        tag_id: 12,
        type_id: 2,
      },
      {
        tag_id: 13,
        type_id: 2,
      },
      {
        tag_id: 14,
        type_id: 2,
      },
      {
        tag_id: 15,
        type_id: 2,
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('tags_types', null, {});
  },
};