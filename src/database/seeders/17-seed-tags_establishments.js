/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

module.exports = {
  up: async (QueryInterface) => {
    await QueryInterface.bulkInsert('tags_establishments', [
      {
        tag_id: 1,
        establishment_id: 753,
      },
      {
        tag_id: 2,
        establishment_id: 753,
      },
      {
        tag_id: 3,
        establishment_id: 753,
      },
      {
        tag_id: 4,
        establishment_id: 753,
      },
      {
        tag_id: 5,
        establishment_id: 753,
      },
      {
        tag_id: 6,
        establishment_id: 753,
      },
      {
        tag_id: 7,
        establishment_id: 753,
      },
      {
        tag_id: 8,
        establishment_id: 753,
      },
      {
        tag_id: 1,
        establishment_id: 488,
      },
      {
        tag_id: 2,
        establishment_id: 488,
      },
      {
        tag_id: 3,
        establishment_id: 488,
      },
      {
        tag_id: 4,
        establishment_id: 488,
      },
      {
        tag_id: 5,
        establishment_id: 488,
      },
      {
        tag_id: 6,
        establishment_id: 488,
      },
      {
        tag_id: 1,
        establishment_id: 3543,
      },
      {
        tag_id: 3,
        establishment_id: 3543,
      },
      {
        tag_id: 4,
        establishment_id: 3543,
      },
      {
        tag_id: 5,
        establishment_id: 3543,
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('tags_establishments', null, {});
  },
};