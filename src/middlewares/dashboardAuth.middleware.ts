/* eslint-disable max-lines-per-function */
import { NextFunction, Request, Response } from 'express';
import authRequestsUtil from '../utils/authRequests.util';

const dashboardAuthMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const token: string | undefined = req.headers.authorization;

  const userInfo = await authRequestsUtil.validateAdminToken(token);

  req.body.userInfo = userInfo;

  next();
};

export default dashboardAuthMiddleware;
