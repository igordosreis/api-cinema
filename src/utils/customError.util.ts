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

export const unauthorizedRequest: ICustomError = {
  status: 400,
  title: 'Acesso não autorizado',
  message: 'Acesso não autorizado. Faça login para acessar esse serviço.',
};

export const userTokenNotFound: ICustomError = {
  status: 400,
  title: 'Usuário não encontrado',
  message: 'Usuário não encontrado. Faça login para acessar esse serviço.',
};
