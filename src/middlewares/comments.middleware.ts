/* eslint-disable max-lines-per-function */
import { NextFunction, Request, Response } from 'express';

const commentsMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  console.log(`
  ----------          ----------          ----------          ----------
  ----------          ----------   req.url       ----------          ----------
  `, req.url);

  console.log(`
  ----------          ----------          ----------          ----------
  ----------          ----------   req.baseUrl       ----------          ----------
  `, req.baseUrl);

  console.log(`
  ----------          ----------          ----------          ----------
  ----------          ----------  req.originalUrl        ----------          ----------
  `, req.originalUrl);

  console.log(`
  ----------          ----------          ----------          ----------
  ----------          ----------  req.method        ----------          ----------
  `, req.method);

  console.log(`
  ----------          ----------          ----------          ----------
  ----------          ----------  req.path        ----------          ----------
  `, req.path);

  console.log(`
  ----------          ----------          ----------          ----------
  ----------          ----------  req.hostname        ----------          ----------
  `, req.hostname);

  next();
};

export default commentsMiddleware;
