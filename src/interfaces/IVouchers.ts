import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import OrdersModel from '../database/models/Orders.model';
import VouchersUserModel from '../database/models/VouchersUser.model';

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

export type IVouchersByDate = OrdersModel & {
  date: Date;
  vouchersOrderPaid: Array<VouchersUserModel & {
    productVoucherInfo: EstablishmentsProductsModel;
  }>
};
// export type IVouchersByDate = Omit<OrdersModel, 'id' |
// 'userId' |
// 'status' |
// 'paymentId' |
// 'totalPrice' |
// 'totalUnits' |
// 'expireAt' |
// 'createdAt' |
// 'updatedAt'> & {
//   date: Date;
//   vouchersOrderPaid: Array<VouchersUserModel & {
//     productVoucherInfo: EstablishmentsProductsModel;
//   }>
// };
