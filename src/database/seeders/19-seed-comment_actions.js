/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

module.exports = {
  up: async (QueryInterface) => {
    await QueryInterface.bulkInsert('comment_actions', [
      {
        name: 'edição de rede',
        url_path: '/establishment/brand/edit',
        http_method: 'PATCH',
      },
      {
        name: 'edição de imagem de rede',
        url_path: '/establishment/image/edit',
        http_method: 'PUT',
      },
      {
        name: 'criação de produto',
        url_path: '/shop/product/create',
        http_method: 'POST',
      },
      {
        name: 'edição de produto',
        url_path: '/shop/product/edit',
        http_method: 'PATCH',
      },
      {
        name: 'criação de pacote',
        url_path: '/shop/pack/create',
        http_method: 'POST',
      },
      {
        name: 'edição de pacote',
        url_path: '/shop/pack/edit',
        http_method: 'PATCH',
      },
      {
        name: 'criação de voucher',
        url_path: '/voucher/create',
        http_method: 'POST',
      },
      {
        name: 'remoção de voucher',
        url_path: '/voucher/withdraw/single',
        http_method: 'PUT',
      },
      {
        name: 'criação de tag',
        url_path: '/tag/create',
        http_method: 'POST',
      },
      {
        name: 'remoção de tipo',
        url_path: '/shop/product/type/remove',
        http_method: 'DELETE',
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('comment_actions', null, {});
  },
};