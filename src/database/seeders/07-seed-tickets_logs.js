/* eslint-disable @typescript-eslint/no-var-requires */
// const { loremCharacters } = require('./seeders.helpers');
const { faker } = require('@faker-js/faker');
// import { faker } from '@faker-js/faker';

// Helper function to generate a random date between the specified years
function generateRandomDate(startYear, endYear) {
  const startDate = new Date(`${startYear}-01-01T00:00:00`);
  const endDate = new Date(`${endYear + 1}-01-01T00:00:00`); // Add 1 to end year to include the entire year
  const randomDate = new Date(startDate.getTime() 
    + Math.random() * (endDate.getTime() - startDate.getTime()));

  // Format the date to "YYYY-MM-DD HH:MM:SS"
  return randomDate.toISOString().slice(0, 19).replace('T', ' ');
}

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    // Generate 30 unique ticket IDs between 1 and 30
    const ticketIds = Array.from({ length: 30 }, (_, index) => index + 1);

    // Shuffle the array to randomize the order
    for (let i = ticketIds.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [ticketIds[i], ticketIds[j]] = [ticketIds[j], ticketIds[i]];
    }

    // Generate 30 entries for the 'vouchers_logs' table
    const seedData = Array.from({ length: 30 }, (_, index) => ({
      request: faker.lorem.sentences(2),
      response: faker.lorem.sentences(2),
      ticket_id: ticketIds[index],
      date: generateRandomDate(2020, 2023),
    }));

    // Insert seed data into the 'vouchers_logs' table
    await queryInterface.bulkInsert('vouchers_logs', seedData, {});
  },

  down: async (queryInterface) => {
    // Remove all entries from the 'vouchers_logs' table
    await queryInterface.bulkDelete('vouchers_logs', null, {});
  },
};
