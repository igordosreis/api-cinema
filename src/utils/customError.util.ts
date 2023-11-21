export type ICustomError = {
  status: number;
  message: string;
  title: string;
  timestamp: string;
};

class CustomError extends Error {
  status: number;
  title: string;
  timestamp: string;

  constructor(error: ICustomError) {
    super(error.message);
    this.status = error.status;
    this.title = error.timestamp;
    this.timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    });
  }
}

export default CustomError;
