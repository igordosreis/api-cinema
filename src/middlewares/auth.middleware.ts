/* eslint-disable max-lines-per-function */
import { NextFunction, Request, Response } from 'express';
import authRequestsUtil from '../utils/authRequests.util';

const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const token: string | undefined = req.headers.authorization;

  const isDashboardUrl = req.originalUrl.includes('/dashboard');
  console.log(`---                   -               isDashboardUrl:
  `, isDashboardUrl);
  console.log(`---                   -               token:
  `, token);
  
  const userInfo = isDashboardUrl
    ? await authRequestsUtil.validateAdminToken(token)
    : await authRequestsUtil.validateUserToken(token);

  req.body.userInfo = userInfo;

  next();
};

export default authMiddleware;
