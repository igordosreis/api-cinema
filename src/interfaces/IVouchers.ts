export interface IVoucherAvailable {
  id: number;
  voucherCode: string;
  productId: number;
  expireDate: Date | null;
  createdAt: Date | null;
}

export interface IVoucherUsed extends IVoucherAvailable {
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
