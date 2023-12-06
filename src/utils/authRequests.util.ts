/* eslint-disable max-lines-per-function */
import axios from 'axios';
import { BEARER_TOKEN, SUPERAPP_URL_BASE_AUTH } from '../constants';
import CustomError, { userTokenNotFound, unauthorizedRequest } from './customError.util';
import { IUserInfo } from '../interfaces/IUser';

class AuthRequests {
  private formatToken = (userToken: string) => (userToken.split(' ').length === 1
    ? userToken
    : userToken.split(' ')[1]);

  validateCinemaTokens = async (userToken: string | undefined) => {
    const isUserTokenNotFound = !userToken;

    if (isUserTokenNotFound) {
      throw new CustomError(userTokenNotFound);
    }

    try {
      const endpoint = SUPERAPP_URL_BASE_AUTH;

      const formattedToken = this.formatToken(userToken);
      const { data: userInfo } = await axios.post<IUserInfo>(
        endpoint,
        { token: `${formattedToken}` },
        {
          headers: { authorization: `${BEARER_TOKEN}` },
        },
      );
      
      return userInfo;
    } catch {
      throw new CustomError(unauthorizedRequest);
    }
  };
}

export default new AuthRequests();
