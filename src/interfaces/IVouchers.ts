export interface IVoucherAvailable {
  id: number;
  voucherCode: string;
  productId: number;
  orderId: number;
  soldPrice: string | null;
  expireAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVoucherUser extends IVoucherAvailable {
  soldAt: string;
  active: boolean;
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
