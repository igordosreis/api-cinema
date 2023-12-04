import { Request } from 'express';
import { IUserInfo } from './IUser';

export interface IVoucherAvailable {
  id: number;
  voucherCode: string;
  productId: number;
  reserved: boolean;
  expireDate: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface IVoucherUser extends IVoucherAvailable {
  paymentId: string | null;
  userId: string | null;
  soldAt: string | null;
  soldPrice: number;
}

export interface IVoucherLog {
  id: number;
  request: string;
  response: string;
  voucherId: number;
  date: Date | null;
}

export interface IVoucherCode {
  id?: number;
  voucherCode: string;
  reservedStatus: boolean;
}

export interface IOrderInfoRaw {
  productId: string | number;
  amountRequested: string | number;
}

export interface IOrderInfoFormatted {
  productId: number;
  amountRequested: number;
}

export interface IOrderRequestRawBody extends Request {
  body: {
    orderInfo: IOrderInfoRaw[];
    userInfo: IUserInfo;
  };
}

export interface IOrderRequestFormattedBody {
  userId: number;
  orderInfo: IOrderInfoFormatted[];
}

export interface ICreateOrderParams {
  productId: number;
  userId: number;
  amountRequested: number;
}
