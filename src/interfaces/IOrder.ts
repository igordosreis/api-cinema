import { IUserInfo } from './IUser';

export interface IOrderSearchRaw extends Express.Request {
  query: {
    orderId: string;
  };
  body: {
    userInfo: IUserInfo;
  };
}

export interface IOrderSearchFormatted {
  orderId: number;
  userId: number;
}
