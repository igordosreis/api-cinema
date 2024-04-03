/* eslint-disable max-lines-per-function */
import { NextFunction, Request, Response } from 'express';
import { IGeolocation } from '../interfaces/IGeolocation';

const geolocationMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const { lastLat, lastLong, geolocation } = <IGeolocation>req.query;

  const isGeolocaionProvided = geolocation;
  if (isGeolocaionProvided) {
    req.body.userInfo.location.geolocation = geolocation;

    const isLastLatAndLastLong = lastLat && lastLong;
    if (isLastLatAndLastLong) {
      req.body.userInfo.location.latitude = lastLat;
      req.body.userInfo.location.longitude = lastLong;
    }
  }

  next();
};

export default geolocationMiddleware;
