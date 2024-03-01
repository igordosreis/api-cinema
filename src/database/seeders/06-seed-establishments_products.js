/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-var-requires */
// const { faker } = require('@faker-js/faker');

// // Helper function to get a random establishment_id from the provided list
// function getRandomEstablishmentId(ids) {
//   return ids[Math.floor(Math.random() * ids.length)];
// }

// // Helper function to get a random name
// function getRandomProductName() {
//   const productNames = ['2D', '3D', '2D Semanal', '3D Semanal', 'Pipoca', 'Refrigerante'];
//   return productNames[Math.floor(Math.random() * productNames.length)];
// }

// // Helper function to generate a random price with two decimals between the specified range
// function generateRandomPrice(min, max) {
//   return (Math.random() * (max - min) + min).toFixed(2);
// }

// // Helper function to get a random type
// function getRandomType() {
//   // const types = ['consumable', 'ticket'];
//   const types = [1, 2];
//   return types[Math.floor(Math.random() * types.length)];
// }

// function getRandomBoolean() {
//   return Math.random() < 0.5; // Adjust the probability as needed
// }

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    // // Establishments IDs from the provided list
    // const establishmentIds = [488, 753, 1115, 3091, 3092, 3543, 3564, 4243, 4732, 4762, 5049];

    // // Generate 10 entries for the 'establishments_addresses' table
    // const seedData = Array.from({ length: 50 }, (_, _index) => ({
    //   establishment_id: getRandomEstablishmentId(establishmentIds),
    //   active: getRandomBoolean(),
    //   purchasable: getRandomBoolean(),
    //   name: getRandomProductName(),
    //   description: faker.lorem.paragraph(1),
    //   image: `https://${faker.lorem.word()}.jpg`,
    //   price: generateRandomPrice(5, 100),
    //   rules: faker.lorem.paragraph(2),
    //   type: getRandomType(),
    //   sold_out_amount: 3,
    // }));

    const data = [
      // CINEART
      {
        establishment_id: 488,
        active: true,
        purchasable: true,
        name: '2D Segunda à Quinta',
        description: 'Válido somente de segunda a quinta. Não aceito em salas 3D e IMAX.',
        price: 20.00,
        type: 1,
        sold_out_amount: 3,
      },
      {
        establishment_id: 488,
        active: true,
        purchasable: true,
        name: '2D Todo Dia',
        description: 'Válido todos os dias. Não aceito em salas 3D e IMAX.',
        price: 21.90,
        type: 1,
        sold_out_amount: 3,
      },
      {
        establishment_id: 488,
        active: true,
        purchasable: true,
        name: '3D',
        description: 'Válido todos os dias. Não aceito em salas 2D e IMAX.',
        price: 25.00,
        type: 1,
        sold_out_amount: 3,
      },
      {
        establishment_id: 488,
        active: true,
        purchasable: true,
        name: 'Combo Kit Médio',
        description: 'Pipoca e refrigerante médios.',
        price: 21.00,
        type: 2,
        sold_out_amount: 3,
      },
      {
        establishment_id: 488,
        active: true,
        purchasable: true,
        name: 'Combo Kit Mega Duplo',
        description: 'Pipoca e refrigerante grandes.',
        price: 29.00,
        type: 2,
        sold_out_amount: 3,
      },

      // CINEMARK
      {
        establishment_id: 753,
        active: true,
        purchasable: true,
        name: '2D Segunda à Quinta',
        description: 'Válido somente de segunda a quinta. Não aceito em salas 3D, XD, Prime e cadeiras DBOX.',
        price: 18.50,
        type: 1,
        sold_out_amount: 3,
      },
      {
        establishment_id: 753,
        active: true,
        purchasable: true,
        name: '2D Todo Dia',
        description: 'Válido todos os dias. Não aceito em salas 3D, XD, Prime e cadeiras DBOX.',
        price: 22.50,
        type: 1,
        sold_out_amount: 3,
      },
      {
        establishment_id: 753,
        active: true,
        purchasable: true,
        name: '3D',
        description: 'Válido todos os dias. Não aceito em salas 2D, XD, Prime e cadeiras DBOX.',
        price: 26.50,
        type: 1,
        sold_out_amount: 3,
      },
      {
        establishment_id: 753,
        active: true,
        purchasable: true,
        name: '3D',
        description: 'Válido todos os dias. Não aceito em salas 2D, XD, Prime e cadeiras DBOX.',
        price: 26.50,
        type: 1,
        sold_out_amount: 3,
      },
      {
        establishment_id: 753,
        active: true,
        purchasable: true,
        name: 'Combo de Pipoca e Refrigerante Pequeno',
        description: 'Válido todos os dias. Exclusivo para Refrigerante e Pipoca Pequeno. Limitado ao estoque disponível.',
        price: 17.50,
        type: 2,
        sold_out_amount: 3,
      },

      // CINEPOLIS
      {
        establishment_id: 3543,
        active: true,
        purchasable: true,
        name: '2D Segunda à Quinta',
        description: 'Válido somente de segunda a quinta (EXCETO NO FERIADO). Não aceito em salas 3D, salas Cinépolis VIP®, Macro XE®, IMAX®, 4DX®, VIP LED®, VIP LASER® e JÚNIOR ®.',
        price: 17.50,
        type: 1,
        sold_out_amount: 3,
      },
      {
        establishment_id: 3543,
        active: true,
        purchasable: true,
        name: '2D Todo Dia',
        description: 'Válido todos os dias, somente em salas tradicionais 2D. Exceto 3D, salas Cinépolis VIP®, Macro XE®, IMAX®, 4DX®, VIP LED®, VIP LASER® e JÚNIOR ®.',
        price: 18.90,
        type: 1,
        sold_out_amount: 3,
      },
      {
        establishment_id: 3543,
        active: true,
        purchasable: true,
        name: '3D',
        description: 'Válido todos os dias.',
        price: 23.50,
        type: 1,
        sold_out_amount: 3,
      },
      {
        establishment_id: 3543,
        active: true,
        purchasable: true,
        name: 'Combo Kit Médio',
        description: 'Refrigerante e Pipoca médios.',
        price: 19.50,
        type: 2,
        sold_out_amount: 3,
      },

      // CINESHOW
      {
        establishment_id: 4732,
        active: true,
        purchasable: true,
        name: '2D Todo Dia',
        description: 'Válido todos os dias. Não aceito em salas 3D e IMAX.',
        price: 16.00,
        type: 1,
        sold_out_amount: 3,
      },

      // CINESYSTEM
      {
        establishment_id: 1115,
        active: true,
        purchasable: true,
        name: '2D Todo Dia',
        description: 'Válido todos os dias. Não aceito em salas 3D.',
        price: 18.80,
        type: 1,
        sold_out_amount: 3,
      },

      // GRUPO CINE
      {
        establishment_id: 1115,
        active: true,
        purchasable: true,
        name: '2D Todo Dia',
        description: 'Válido todos os dias. Não aceito em salas 3D e IMAX.',
        price: 13.00,
        type: 1,
        sold_out_amount: 3,
      },

      // KINOPLEX
      {
        establishment_id: 3092,
        active: true,
        purchasable: true,
        name: '2D Segunda à Quinta',
        description: 'Válido somente de segunda a quinta. Não aceito em salas 3D. Os Vouchers só poderão ser trocados para no dia da sessão escolhida nas bilheterias do Kinoplex. Não são válidos para salas 3D, Imax e Platinum. Esta opção não é válida para o Kinoplex RioSul (RJ) e Kinoplex Golden (MA). Não são válidos no Kinoplex Vale Sul (SP) e Kinoplex Parque da Cidade (SP). Não são válidos em cinemas em pareceria com a UCI (UCI Kinoplex). Não são válidos para conteúdos especiais como shows, balé, ópera, jogos, entre outros.',
        price: 16.90,
        type: 1,
        sold_out_amount: 3,
      },
      {
        establishment_id: 3092,
        active: true,
        purchasable: true,
        name: '2D Todo Dia',
        description: 'Válido todos os dias. Não aceito em salas 3D. Os Vouchers só poderão ser trocados para no dia da sessão escolhida nas bilheterias do Kinoplex. Não são válidos para salas 3D, Imax e Platinum. Esta opção não é válida para o Kinoplex RioSul (RJ) e Kinoplex Golden (MA). Não são válidos no Kinoplex Vale Sul (SP) e Kinoplex Parque da Cidade (SP). Não são válidos em cinemas em pareceria com a UCI (UCI Kinoplex). Não são válidos para conteúdos especiais como shows, balé, ópera, jogos, entre outros.',
        price: 18.90,
        type: 1,
        sold_out_amount: 3,
      },

      // MOVIECOM
      {
        establishment_id: 3091,
        active: true,
        purchasable: true,
        name: '2D e 3D Todo Dia',
        description: 'Válido todos os dias, em salas 2D ou 3D.',
        price: 17.50,
        type: 1,
        sold_out_amount: 3,
      },

      // UCI
      {
        establishment_id: 3091,
        active: true,
        purchasable: true,
        name: '2D Segunda à Quinta',
        description: 'Válido somente de segunda a quinta. Não aceito em salas 3D digital, conteúdos alternativos, Salas Xplus, IMAX, DE LUX, 4DX e Poltronas Superseat. Válido nos cinemas das redes UCI, UCI Kinoplex e UCi Orient. Não Válido para retirada pelo site.',
        price: 16.90,
        type: 1,
        sold_out_amount: 3,
      },
      {
        establishment_id: 3091,
        active: true,
        purchasable: true,
        name: '2D Todo Dia',
        description: 'Válido todos os dias. Não aceito em salas 3D digital, conteúdos alternativos, Salas Xplus, IMAX, DE LUX, 4DX e Poltronas Superseat. Válido nos cinemas das redes UCI, UCI Kinoplex e UCi Orient. Não Válido para retirada pelo site.',
        price: 18.80,
        type: 1,
        sold_out_amount: 3,
      },
      {
        establishment_id: 3091,
        active: true,
        purchasable: true,
        name: '3D',
        description: 'Válido todos os dias. Aceito em salas 3D Digital.',
        price: 22.00,
        type: 1,
        sold_out_amount: 3,
      },
      {
        establishment_id: 3091,
        active: true,
        purchasable: true,
        name: 'Combo de Pipoca salgada e Refrigerante 500ml',
        description: 'Válido todos os dias. Exclusivo para Refrigerante 500ml e Pipoca salgada. Limitado ao estoque disponível.',
        price: 20.00,
        type: 2,
        sold_out_amount: 3,
      },

      // UNIPLEX
      {
        establishment_id: 4762,
        active: true,
        purchasable: true,
        name: '2D Todo Dia',
        description: 'Válido todos os dias. Não aceito em salas 3D e IMAX.',
        price: 17.00,
        type: 1,
        sold_out_amount: 3,
      },

      // CINE A
      {
        establishment_id: 5049,
        active: true,
        purchasable: true,
        name: '2D Todo Dia',
        description: 'Válido todos os dias. Não aceito em salas 3D.',
        price: 14.90,
        type: 1,
        sold_out_amount: 3,
      },
    ];

    await queryInterface.bulkInsert('establishments_products', data, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('establishments_products', null, {});
  },
};
