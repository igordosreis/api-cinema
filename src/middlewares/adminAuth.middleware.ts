/* eslint-disable max-lines-per-function */
import { NextFunction, Request, Response } from 'express';
import authRequestsUtil from '../utils/authRequests.util';

const adminAuthMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const token: string | undefined = req.headers.authorization;

  await authRequestsUtil.validateAdminToken(token);

  next();
};

export default adminAuthMiddleware;
