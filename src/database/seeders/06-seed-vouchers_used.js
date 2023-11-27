// Helper function to generate a random date between the specified years
function generateRandomDate(startYear, endYear) {
  const startDate = new Date(`${startYear}-01-01T00:00:00`);
  const endDate = new Date(`${endYear + 1}-01-01T00:00:00`); // Add 1 to end year to include the entire year
  const randomDate = new Date(startDate.getTime() + Math.random() 
  * (endDate.getTime() - startDate.getTime()));

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

// Helper function to generate a unique payment_id string
function generateUniquePaymentId() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let paymentId = '';

  for (let i = 0; i < 15; i += 1) {
    paymentId += characters.charAt(Math.floor(Math.random() * characters.length));
    if (i === 4 || i === 9) {
      paymentId += '.';
    }
  }

  return paymentId;
}

// Helper function to generate a random price with two decimals between the specified range
function generateRandomPrice(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    // Generate 10 entries for the 'vouchers_used' table
    const seedData = Array.from({ length: 30 }, (_, index) => ({
      id: index + 1,
      voucher_code: generateUniqueVoucher(),
      product_id: Math.floor(Math.random() * 50), // Random number between 0 and 50
      user_id: Math.floor(Math.random() * 10000) + 1, // Random number between 1 and 10000
      expire_date: generateRandomDate(2022, 2023),
      payment_id: generateUniquePaymentId(),
      created_at: generateRandomDate(2022, 2023),
      sold_at: generateRandomDate(2022, 2023),
      sold_price: generateRandomPrice(10, 300),
    }));

    // Insert seed data into the 'vouchers_used' table
    await queryInterface.bulkInsert('vouchers_used', seedData, {});
  },

  down: async (queryInterface) => {
    // Remove all entries from the 'vouchers_used' table
    await queryInterface.bulkDelete('vouchers_used', null, {});
  },
};
