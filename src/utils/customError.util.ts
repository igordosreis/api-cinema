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
  status: 400,
  title: 'Acesso não autorizado.',
  message: 'Acesso não autorizado. Faça login para acessar esse serviço.',
};

export const userTokenNotFound: ICustomError = {
  status: 400,
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

export const orderServiceUnavailable: ICustomError = {
  status: 503,
  title: 'Operacão indisponível.',
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

export const paymentOrderError: ICustomError = {
  status: 503,
  title: 'Pagamento não realizado.',
  message: 'Erro ao realizar o pagamento. Tente novamente mais tarde.',
};

export const cancelUnauthorized: ICustomError = {
  status: 400,
  title: 'Cancelamento não autorizado.',
  message: 'Somente pedidos com pagamento pendente podem ser cancelados.',
};

export const amountUnauthorized = (name: string): ICustomError => {
  const errorObject = {
    status: 400,
    title: `Quantidade de ${name} não autorizada.`,
    message: `A quantidade de ${name} no pedido é maior do que a quantidade disponível no seu plano.`,
  };

  return errorObject;
};

export const establishmentServiceUnavailable: ICustomError = {
  status: 503,
  title: 'Operacão indisponível.',
  message:
    'O serviço de estabelecimentos não está disponível no momento. Tente novamente mais tarde.',
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
