/* eslint-disable max-lines-per-function */
import axios from 'axios';
import {
  BEARER_TOKEN,
  SUPERAPP_URL_DASHBOARD_AUTH,
  SUPERAPP_URL_BASE_AUTH,
  SUPERAPP_URL_ADMIN_AUTH,
} from '../constants';
import CustomError, { userTokenNotFound, requestUnauthorized } from './customError.util';
import { IUserInfo } from '../interfaces/IUser';
import { IAdminInfo } from '../interfaces/IAdmin';

class AuthRequests {
  private formatCinemaToken = (userToken: string) =>
    (userToken.split(' ').length === 1 ? userToken : userToken.split(' ')[1]);

  validateAppToken = async (appToken: string | undefined) => {
    const isAppTokenNotFound = !appToken;
    if (isAppTokenNotFound) {
      throw new CustomError(userTokenNotFound);
    }

    try {
      const endpoint = SUPERAPP_URL_BASE_AUTH;

      const formattedToken = this.formatCinemaToken(appToken);
      const { data: userInfo } = await axios.post<IUserInfo>(
        endpoint,
        { token: `${formattedToken}` },
        {
          headers: { authorization: `${BEARER_TOKEN}` },
        },
      );

      return userInfo;
    } catch {
      throw new CustomError(requestUnauthorized);
    }
  };

  validateDashboardToken = async (dashboardToken: string | undefined) => {
    const isDashboardTokenNotFound = !dashboardToken;
    if (isDashboardTokenNotFound) {
      throw new CustomError(userTokenNotFound);
    }

    try {
      const endpoint = SUPERAPP_URL_DASHBOARD_AUTH;

      const formattedToken = this.formatCinemaToken(dashboardToken);
      const { data: userInfo } = await axios.post<IAdminInfo>(
        endpoint,
        { token: `${formattedToken}` },
        {
          headers: { authorization: `${BEARER_TOKEN}` },
        },
      );

      return userInfo;
    } catch {
      throw new CustomError(requestUnauthorized);
    }
  };

  validateAdminToken = async (adminToken: string | undefined) => {
    const isAdminTokenNotFound = !adminToken;
    if (isAdminTokenNotFound) {
      throw new CustomError(userTokenNotFound);
    }

    try {
      const endpoint = SUPERAPP_URL_ADMIN_AUTH;

      const formattedToken = this.formatCinemaToken(adminToken);
      const { data: userInfo } = await axios.post<IAdminInfo>(
        endpoint,
        { token: `${formattedToken}` },
        {
          headers: { authorization: `${BEARER_TOKEN}` },
        },
      );

      return userInfo;
    } catch {
      throw new CustomError(requestUnauthorized);
    }
  };
}

export default new AuthRequests();
