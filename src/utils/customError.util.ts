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

export const FetchError: ICustomError = {
  status: 503,
  message: 'Servidor indisponível.',
  title: 'Servidor indisponível, tente novamente mais tarde.',
};
