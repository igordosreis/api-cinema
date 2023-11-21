/* eslint-disable max-lines-per-function */
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import CustomError from '../utils/customError.util';

const errorMiddleware = (error: CustomError, req: Request, res: Response, _next: NextFunction) => {
  console.log({ error });
  console.log({ method: req.method, route: req.url });
  if (error instanceof ZodError) {
    const formatErrorMessage = {
      error: error.issues,
      title: 'Erro de validação.',
      message: `Falha nos campos: ${error.issues.map(({ path }) => path[0])}.`,
    };
    return res.status(400).json(formatErrorMessage);
  }
  if (error.status !== undefined) {
    return res.status(error.status).json({ message: error.message, title: error.title });
  }
  return res.status(500).json({
    message: 'Erro interno do servidor.',
    title: 'Erro interno do servidor, tente novamente.',
  });
};

export default errorMiddleware;
