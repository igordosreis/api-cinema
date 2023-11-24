/* eslint-disable max-lines-per-function */
import { NextFunction, Request, Response } from 'express';
import authRequestsUtil from '../utils/authRequests.util';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { token: userToken }: { token: string } = req.body;

  const userInfo = authRequestsUtil.validateBearerToken(userToken);

  req.body.userInfo = userInfo;

  next();
};

export default authMiddleware;
