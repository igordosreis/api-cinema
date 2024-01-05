/* eslint-disable max-lines-per-function */
import { NextFunction, Request, Response } from 'express';
import { IGeolocation } from '../interfaces/IGeolocation';

const geolocationMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const { lastLat, lastLong } = <IGeolocation>req.query;

  if (lastLat && lastLong) {
    req.body.userInfo.location.latitude = lastLat;
    req.body.userInfo.location.longitude = lastLong;
  }

  next();
};

export default geolocationMiddleware;
