import { OPERATION_UNAVAILABLE } from '../constants';

/* eslint-disable max-len */
export type ICustomError = {
  status: number;
  message: string;
  title: string;
};

class CustomError extends Error {
  status: number;
  title: string;
  timestamp: string;

  constructor(error: ICustomError) {
    super(error.message);
    this.status = error.status;
    this.title = error.title;
    this.timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    });
  }
}

export default CustomError;

export const fetchError: ICustomError = {
  status: 503,
  title: 'Servidor indisponível.',
  message: 'Servidor indisponível, tente novamente mais tarde.',
};

export const requestUnauthorized: ICustomError = {
  status: 401,
  title: 'Acesso não autorizado.',
  message: 'Acesso não autorizado. Faça login para acessar esse serviço.',
};

export const userTokenNotFound: ICustomError = {
  status: 404,
  title: 'Usuário não encontrado.',
  message: 'Usuário não encontrado. Faça login para acessar esse serviço.',
};

export const vouchersUnavailable: ICustomError = {
  status: 404,
  title: 'Vouchers indisponíveis.',
  message: 'Não há mais vouchers disponíveis para esse produto.',
};

export const vouchersNotEnough: ICustomError = {
  status: 404,
  title: 'Vouchers insuficientes.',
  message: 'Não há vouchers suficientes para atender o seu pedido.',
};

export const vouchersNotFound: ICustomError = {
  status: 404,
  title: 'Vouchers não encontrados.',
  message: 'Nenhum voucher foi encontrado.',
};

export const voucherServiceUnavailable: ICustomError = {
  status: 503,
  title: OPERATION_UNAVAILABLE,
  message: 'O serviço de vouchers não está disponível no momento. Tente novamente mais tarde.',
};

export const vouchersObjectNotFound: ICustomError = {
  status: 404,
  title: 'Vouchers não econtrados.',
  message: 'Os vouchers devem ser enviados por um array de strings no body ou por um arquivo de Excel.',
};

export const cannotCreateVouchers: ICustomError = {
  status: 500,
  title: OPERATION_UNAVAILABLE,
  message: 'Não foi possível adicionar os vouchers agora. Tente novamente mais tarde.',
};

export const cannotGetVouchers: ICustomError = {
  status: 500,
  title: OPERATION_UNAVAILABLE,
  message: 'Não foi possível buscar os vouchers agora. Tente novamente mais tarde.',
};

export const orderServiceUnavailable: ICustomError = {
  status: 503,
  title: OPERATION_UNAVAILABLE,
  message: 'O serviço de pedidos não está disponível no momento. Tente novamente mais tarde.',
};

export const ordersNotFound: ICustomError = {
  status: 404,
  title: 'Pedidos não encontrados.',
  message: 'Nenhum pedido foi encontrado.',
};

export const orderNotFound: ICustomError = {
  status: 404,
  title: 'Pedido não encontrado.',
  message: 'Esse pedido não foi encontrado.',
};

export const openOrder: ICustomError = {
  status: 401,
  title: 'Pedido não autorizado.',
  message:
    'Existe um pedido em aberto. Conclua o pagamento ou cancele o pedido para realizar novos pedidos.',
};

export const paymentOrderError: ICustomError = {
  status: 503,
  title: 'Pagamento não realizado.',
  message: 'Erro ao realizar o pagamento. Tente novamente mais tarde.',
};

export const cancelUnauthorized: ICustomError = {
  status: 401,
  title: 'Cancelamento não autorizado.',
  message: 'Somente pedidos com pagamento pendente podem ser cancelados.',
};

export const amountUnauthorized = (name: string): ICustomError => {
  const errorObject = {
    status: 401,
    title: `Quantidade de ${name} não autorizada.`,
    message: `A quantidade de ${name} no pedido é maior do que a quantidade disponível no seu plano.`,
  };

  return errorObject;
};

export const establishmentServiceUnavailable: ICustomError = {
  status: 503,
  title: OPERATION_UNAVAILABLE,
  message:
    'O serviço de estabelecimentos não está disponível no momento. Tente novamente mais tarde.',
};

export const totalError: ICustomError = {
  status: 503,
  title: OPERATION_UNAVAILABLE,
  message: 'Não foi possível realizar essa operação nesse. Tente novamente mais tarde.',
};

export const favoriteError: ICustomError = {
  status: 503,
  title: OPERATION_UNAVAILABLE,
  message: 'O serviço de favoritos não está disponível no momento. Tente novamente mais tarde.',
};

export const cartAddError: ICustomError = {
  status: 503,
  title: OPERATION_UNAVAILABLE,
  message:
    'Não foi possível adicionar o produto no carrinho no momento. Tente novamente mais tarde.',
};

export const cartRemoveError: ICustomError = {
  status: 503,
  title: OPERATION_UNAVAILABLE,
  message: 'Não foi possível remover o produto do carrinho no momento. Tente novamente mais tarde.',
};

export const cartAccessError: ICustomError = {
  status: 503,
  title: OPERATION_UNAVAILABLE,
  message: 'Não foi possível acessar o carrinho no momento. Tente novamente mais tarde.',
};

export const cartRemoveAllError: ICustomError = {
  status: 503,
  title: OPERATION_UNAVAILABLE,
  message:
    'Não foi possível remover os produtos do carrinho no momento. Tente novamente mais tarde.',
};

export const cartIsEmpty: ICustomError = {
  status: 400,
  title: 'Carrinho vazio.',
  message: 'O carrinho está vazio. Adicione um produto para poder fazer um pedido.',
};

export const badCartObject: ICustomError = {
  status: 400,
  title: OPERATION_UNAVAILABLE,
  message: 'O carrinho precisa conter ou um produto ou um pacote.',
};

export const cancelError: ICustomError = {
  status: 503,
  title: OPERATION_UNAVAILABLE,
  message: 'Não foi possível cancelar seu pedido. Tente novamente mais tarde.',
};

export const movieNotFound: ICustomError = {
  status: 404,
  title: 'Filme não encontrado.',
  message: 'O filme procurado não foi encontrado.',
};

export const productNotFound: ICustomError = {
  status: 404,
  title: 'Produto não encontrado.',
  message: 'O produto procurado não foi encontrado.',
};

export const createProductError: ICustomError = {
  status: 500,
  title: 'Produto não registrado.',
  message: 'Não foi possível registrar o produto no momento. Tente noavmente mais tarde.',
};

export const planNotFound: ICustomError = {
  status: 404,
  title: 'Plano não encontrado.',
  message: 'O plano procurado não foi encontrado.',
};

export const packNotFound: ICustomError = {
  status: 404,
  title: 'Pacote não encontrado.',
  message: 'O pacote procurado não foi encontrado.',
};

export const createTagError: ICustomError = {
  status: 503,
  title: 'Erro ao criar tags.',
  message: 'Não foi possível criar as tags agora. Tente novamente mais tarde.',
};

export const getTagsError: ICustomError = {
  status: 503,
  title: 'Erro ao buscar tags.',
  message: 'Não foi possível buscar as tags agora. Tente novamente mais tarde.',
};
