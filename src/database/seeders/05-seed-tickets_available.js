// Helper function to generate a random date between the specified years
function generateRandomDate(startYear, endYear) {
  const startDate = new Date(`${startYear}-01-01T00:00:00`);
  const endDate = new Date(`${endYear + 1}-01-01T00:00:00`); // Add 1 to end year to include the entire year
  const randomDate = new Date(startDate.getTime() 
  + Math.random() * (endDate.getTime() - startDate.getTime()));

  // Format the date to "YYYY-MM-DD HH:MM:SS"
  return randomDate.toISOString().slice(0, 19).replace('T', ' ');
}

// Helper function to generate a unique voucher string
function generateUniqueVoucher() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let voucher = '';

  for (let i = 0; i < 30; i += 1) {
    voucher += characters.charAt(Math.floor(Math.random() * characters.length));
    if (i === 9 || i === 19) {
      voucher += '.';
    }
  }

  return voucher;
}

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    // Generate 30 entries for the 'tickets_available' table
    const seedData = Array.from({ length: 30 }, (_, _index) => ({
      voucher: generateUniqueVoucher(),
      product_id: Math.floor(Math.random() * 1001), // Random number between 0 and 1000
      expire_date: generateRandomDate(2022, 2023),
      created_at: generateRandomDate(2022, 2023),
    }));

    // Insert seed data into the 'tickets_available' table
    await queryInterface.bulkInsert('tickets_available', seedData, {});
  },

  down: async (queryInterface) => {
    // Remove all entries from the 'tickets_available' table
    await queryInterface.bulkDelete('tickets_available', null, {});
  },
};
