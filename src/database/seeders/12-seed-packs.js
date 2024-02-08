/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-var-requires */
const { faker } = require('@faker-js/faker');

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
function generateRandomPrice(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

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
    await queryInterface.bulkInsert('packs', [
      {
        active: true,
        name: 'Pacote 1',
        description: faker.lorem.paragraph(1),
        image: `https://${faker.lorem.word()}.jpg`,
        price: generateRandomPrice(5, 100),
        rules: faker.lorem.paragraph(2),
        counter: null,
        counter_limit: null,
        limited: false,
        establishment_id: 488,
      },
      {
        active: true,
        name: 'Pacote 2',
        description: faker.lorem.paragraph(1),
        image: `https://${faker.lorem.word()}.jpg`,
        price: generateRandomPrice(5, 100),
        rules: faker.lorem.paragraph(2),
        counter: 0,
        counter_limit: 10,
        limited: true,
        establishment_id: 488,
      },
      {
        active: false,
        name: 'Pacote 3',
        description: faker.lorem.paragraph(1),
        image: `https://${faker.lorem.word()}.jpg`,
        price: generateRandomPrice(5, 100),
        rules: faker.lorem.paragraph(2),
        counter: null,
        counter_limit: null,
        limited: false,
        establishment_id: 488,
      },
      {
        active: false,
        name: 'Pacote 4',
        description: faker.lorem.paragraph(1),
        image: `https://${faker.lorem.word()}.jpg`,
        price: generateRandomPrice(5, 100),
        rules: faker.lorem.paragraph(2),
        counter: 0,
        counter_limit: 10,
        limited: true,
        establishment_id: 488,
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('packs', null, {});
  },
};
