import axios from 'axios';
import { BEARER_TOKEN, SUPERAPP_URL_BASE_AUTH } from '../constants';
import CustomError, { unauthorizedRequest } from './customError.util';
import { IUserInfo } from '../interfaces/IUser';

class AuthRequests {
  validateBearerToken = async (userToken: string) => {
    try {
      const endpoint = SUPERAPP_URL_BASE_AUTH;

      const { data: userInfo } = await axios.post<IUserInfo>(
        endpoint, 
        [
          { token: `${userToken}` },
        ], 
        {
          headers: { authorization: `Bearer ${BEARER_TOKEN}` },
        },
      );

      return userInfo;
    } catch {
      throw new CustomError(unauthorizedRequest);
    }
  };
}

export default new AuthRequests();
