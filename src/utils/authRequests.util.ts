/* eslint-disable max-lines-per-function */
import axios from 'axios';
import { BEARER_TOKEN, SUPERAPP_URL_ADMIN_AUTH, SUPERAPP_URL_BASE_AUTH } from '../constants';
import CustomError, { userTokenNotFound, requestUnauthorized } from './customError.util';
import { IUserInfo } from '../interfaces/IUser';
import { IAdminInfo } from '../interfaces/IAdmin';

class AuthRequests {
  private formatCinemaToken = (userToken: string) =>
    (userToken.split(' ').length === 1 ? userToken : userToken.split(' ')[1]);

  validateUserToken = async (userToken: string | undefined) => {
    const isUserTokenNotFound = !userToken;
    if (isUserTokenNotFound) {
      throw new CustomError(userTokenNotFound);
    }

    try {
      const endpoint = SUPERAPP_URL_BASE_AUTH;

      const formattedToken = this.formatCinemaToken(userToken);
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

  validateAdminToken = async (userToken: string | undefined) => {
    const isUserTokenNotFound = !userToken;
    if (isUserTokenNotFound) {
      throw new CustomError(userTokenNotFound);
    }

    try {
      const endpoint = SUPERAPP_URL_ADMIN_AUTH;

      const formattedToken = this.formatCinemaToken(userToken);
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
