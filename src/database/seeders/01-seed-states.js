/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

module.exports = {
  up: async (QueryInterface) => {
    await QueryInterface.bulkInsert('states', [
      { id: 0, name: 'Todos', regionId: 1, abbreviation: null },
      { id: 1, name: 'Acre', regionId: 1, abbreviation: 'AC' },
      { id: 2, name: 'Alagoas', regionId: 2, abbreviation: 'AL' },
      { id: 3, name: 'Amapá', regionId: 1, abbreviation: 'AP' },
      { id: 4, name: 'Amazonas', regionId: 1, abbreviation: 'AM' },
      { id: 5, name: 'Bahia', regionId: 2, abbreviation: 'BA' },
      { id: 6, name: 'Ceará', regionId: 2, abbreviation: 'CE' },
      { id: 7, name: 'Distrito Federal', regionId: 5, abbreviation: 'DF' },
      { id: 8, name: 'Espiríto Santo', regionId: 4, abbreviation: 'ES' },
      { id: 9, name: 'Goiás', regionId: 5, abbreviation: 'GO' },
      { id: 10, name: 'Maranhão', regionId: 2, abbreviation: 'MA' },
      { id: 11, name: 'Mato Grosso', regionId: 5, abbreviation: 'MT' },
      { id: 12, name: 'Mato Grosso do Sul', regionId: 5, abbreviation: 'MS' },
      { id: 13, name: 'Minas Gerais', regionId: 4, abbreviation: 'MG' },
      { id: 14, name: 'Pará', regionId: 1, abbreviation: 'PA' },
      { id: 15, name: 'Paraíba', regionId: 2, abbreviation: 'PB' },
      { id: 16, name: 'Paraná', regionId: 3, abbreviation: 'PR' },
      { id: 17, name: 'Pernambuco', regionId: 2, abbreviation: 'PE' },
      { id: 18, name: 'Piauí', regionId: 2, abbreviation: 'PI' },
      { id: 19, name: 'Rio de Janeiro', regionId: 4, abbreviation: 'RJ' },
      {
        id: 20,
        name: 'Rio Grande do Norte',
        regionId: 2,
        abbreviation: 'RN',
      },
      { id: 21, name: 'Rio Grande do Sul', regionId: 3, abbreviation: 'RS' },
      { id: 22, name: 'Rondônia', regionId: 1, abbreviation: 'RO' },
      { id: 23, name: 'Roraima', regionId: 1, abbreviation: 'RR' },
      { id: 24, name: 'Santa Catarina', regionId: 3, abbreviation: 'SC' },
      { id: 25, name: 'São Paulo', regionId: 4, abbreviation: 'SP' },
      { id: 26, name: 'Sergipe', regionId: 2, abbreviation: 'SE' },
      { id: 27, name: 'Tocantins', regionId: 1, abbreviation: 'TO' },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('states', null, {});
  },
};