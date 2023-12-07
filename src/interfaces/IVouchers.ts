import { Request } from 'express';
import { IUserInfo } from './IUser';

export interface IVoucherAvailable {
  id: number;
  voucherCode: string;
  productId: number;
  orderId: number;
  expireAt: Date | null;
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

export interface IOrderRequestRaw {
  productId: string | number;
  amountRequested: string | number;
}

export interface IOrderRequestFormatted {
  productId: number;
  amountRequested: number;
}

export interface IOrderRequestRawBody extends Request {
  body: {
    orderInfo: IOrderRequestRaw[];
    userInfo: IUserInfo;
  };
}

export interface IOrderRequestFormattedBody {
  userId: number;
  orderInfo: IOrderRequestFormatted[];
}

export interface ICreateOrderParams {
  productId: number;
  userId: number;
  amountRequested: number;
}
