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

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    // Establishments IDs from the provided list
    // const establishmentIds = [488, 753, 1115, 3091, 3092, 3543, 3564, 4243, 4732, 4762, 5049];

    const seedData = Array.from({ length: 1 }, (_, _index) => ({
      batch_id: 'BCG1202',
      product_id: 1,
      establishment_id: 488,
      expire_at: '2027-01-01 00:00:00',
    }));

    await queryInterface.bulkInsert('batches', seedData, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('batches', null, {});
  },
};
