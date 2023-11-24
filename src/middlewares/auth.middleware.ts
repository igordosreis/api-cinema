/* eslint-disable max-lines-per-function */
// --- FOR TESTING PURPOSES --- FOR TESTING PURPOSES --- FOR TESTING PURPOSES
import 'dotenv/config'; //  --- FOR TESTING PURPOSES --- FOR TESTING PURPOSES
// --- FOR TESTING PURPOSES --- FOR TESTING PURPOSES --- FOR TESTING PURPOSES

import { NextFunction, Request, Response } from 'express';
import authRequestsUtil from '../utils/authRequests.util';

const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  // const token: string | undefined = req.headers.authorization;
  
  // --- FOR TESTING PURPOSES --- FOR TESTING PURPOSES --- FOR TESTING PURPOSES
  const token = process.env.TEST_USER_TOKEN; // --- FOR TESTING PURPOSES --- FO
  // --- FOR TESTING PURPOSES --- FOR TESTING PURPOSES --- FOR TESTING PURPOSES

  const userInfo = authRequestsUtil.validateBearerToken(token);
  req.body.userInfo = userInfo;

  next();
};

export default authMiddleware;
