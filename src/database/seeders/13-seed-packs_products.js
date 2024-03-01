/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-var-requires */
// const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    const seedData = [
      {
        pack_id: 1,
        product_id: 7,
        quantity: 1,
        price: 15.00,
      },
      {
        pack_id: 1,
        product_id: 10,
        quantity: 1,
        price: 14.00,
      },
      {
        pack_id: 2,
        product_id: 8,
        quantity: 1,
        price: 20.00,
      },
      {
        pack_id: 2,
        product_id: 10,
        quantity: 1,
        price: 14.00,
      },
      {
        pack_id: 3,
        product_id: 7,
        quantity: 2,
        price: 15.00,
      },
      {
        pack_id: 3,
        product_id: 10,
        quantity: 2,
        price: 14.00,
      },
      {
        pack_id: 4,
        product_id: 8,
        quantity: 2,
        price: 20.00,
      },
      {
        pack_id: 4,
        product_id: 10,
        quantity: 2,
        price: 14.00,
      },
    ];
    await queryInterface.bulkInsert('packs_products', seedData, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('packs_products', null, {});
  },
};
