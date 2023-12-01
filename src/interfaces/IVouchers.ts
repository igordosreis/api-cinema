import { Request } from 'express';

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

export interface IReserveVoucherRawQuery extends Request {
  productId: string | undefined;
  userId: string | undefined;
  amount: number | undefined;
}

export interface IReserveVoucherFormattedQuery {
  productId: number;
  userId: number;
  amount: number;
  reserveStatus: boolean;
}

export interface UpdateVouchersParams {
  productId: number;
  userId: number;
  amount: number;
  reserveStatus: boolean;
}
