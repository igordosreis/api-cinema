/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-var-requires */
// const { faker } = require('@faker-js/faker');

// Helper function to get a random establishment_id from the provided list
// function getRandomEstablishmentId(ids) {
//   return ids[Math.floor(Math.random() * ids.length)];
// }

// Helper function to get a random name
// function getRandomProductName() {
//   const productNames = ['2D', '3D', '2D Semanal', '3D Semanal', 'Pipoca', 'Refrigerante'];
//   return productNames[Math.floor(Math.random() * productNames.length)];
// }

// Helper function to generate a random price with two decimals between the specified range
// function generateRandomPrice(min, max) {
//   return (Math.random() * (max - min) + min).toFixed(2);
// }

// Helper function to get a random type
// function getRandomType() {
//   const types = ['consumable', 'ticket'];
//   return types[Math.floor(Math.random() * types.length)];
// }

// function getRandomBoolean() {
//   return Math.random() < 0.5; // Adjust the probability as needed
// }
// const typesArray = ['ticket', 'consumable'];

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    const seedData = [
      {
        planId: 0,
        productTypeId: 0,
        quantity: 4,
      },
      {
        planId: 0,
        productTypeId: 1,
        quantity: 4,
      },
      {
        planId: 1,
        productTypeId: 0,
        quantity: 8,
      },
      {
        planId: 1,
        productTypeId: 1,
        quantity: 8,
      },
      {
        planId: 2,
        productTypeId: 0,
        quantity: 12,
      },
      {
        planId: 2,
        productTypeId: 1,
        quantity: 12,
      },
    ];
    await queryInterface.bulkInsert('plans', seedData, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('plans', null, {});
  },
};
