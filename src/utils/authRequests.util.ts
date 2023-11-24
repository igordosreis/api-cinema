import axios from 'axios';
import { BEARER_TOKEN, SUPERAPP_URL_BASE_AUTH } from '../constants';
import CustomError, { unauthorizedRequest } from './customError.util';

class AuthRequests {
  validateBearerToken = async (userToken: string) => {
    try {
      const endpoint = SUPERAPP_URL_BASE_AUTH;

      const userInfo = await axios.post(
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
