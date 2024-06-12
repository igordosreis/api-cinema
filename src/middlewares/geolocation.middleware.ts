/* eslint-disable max-lines-per-function */
import { NextFunction, Request, Response } from 'express';
import { IGeolocation } from '../interfaces/IGeolocation';

const ROUTES_WHITELIST = [
  '/offer',
  '/brands/',
];

const geolocationMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const { lastLat, lastLng, geolocation } = <IGeolocation>req.query;

  const isGeolocationProvided = geolocation;
  const isRouteWhiteListed = ROUTES_WHITELIST.some((route) => req.path.includes(route));

  if (isGeolocationProvided || isRouteWhiteListed) {
    req.body.userInfo.location.geolocation = geolocation;

    const isLastLatAndlastLng = lastLat && lastLng;
    if (isLastLatAndlastLng) {
      req.body.userInfo.location.latitude = lastLat;
      req.body.userInfo.location.longitude = lastLng;
    }
  }

  next();
};

export default geolocationMiddleware;
