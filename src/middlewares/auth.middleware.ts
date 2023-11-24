/* eslint-disable max-lines-per-function */
import { NextFunction, Request, Response } from 'express';
import CustomError from '../utils/customError.util';

const authMiddleware = (error: CustomError, req: Request, res: Response, _next: NextFunction) => {
  console.log({ error });
  console.log({ method: req.method, route: req.url });
  if (error.status !== undefined) {
    return res.status(error.status).json({ message: error.message, title: error.title });
  }

  return res.status(500).json({
    message: 'Erro interno do servidor.',
    title: 'Erro interno do servidor, tente novamente.',
  });
};

export default authMiddleware;
