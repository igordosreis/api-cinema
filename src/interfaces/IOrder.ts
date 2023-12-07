import { Transaction } from 'sequelize';
import { IUserInfo } from './IUser';
import { IVoucherAvailable, IVoucherUser } from './IVouchers';
import OrdersModel from '../database/models/Orders.model';

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
  transaction?: Transaction;
}

export interface IOrderSucessUpdate {
  orderId: number;
  userId: number;
}

// export interface IOrderInfo {
//   id: number;
//   userId: number;
//   status: string;
//   paymentId: string;
//   totalPrice: string;
//   totalUnits: number;
//   totalConsumables: number;
//   totalTickets: number;
//   expireAt: string;
//   createdAt: string;
//   updatedAt: string;
//   vouchersOrderUnpaid: IVoucherAvailable[];
//   vouchersOrderPaid: IVoucherUser[];
// }

export type IOrderInfo = OrdersModel & {
  vouchersOrderUnpaid: IVoucherAvailable[];
  vouchersOrderPaid: IVoucherUser[];
};
