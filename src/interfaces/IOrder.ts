import { Request } from 'express';
import { Transaction } from 'sequelize';
import { IUserInfo } from './IUser';
// import { IVoucherAvailable, IVoucherUser } from './IVouchers';
import OrdersModel from '../database/models/Orders.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import VouchersUserModel from '../database/models/VouchersUser.model';
import OrdersProductsModel from '../database/models/OrdersProducts.model';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';

type Totals = 'totalPrice' | 'totalUnits' | 1 | 2;
export type PriceUnitAndTypeTotals = Record<Totals, number>;

export interface IOrderSearchRaw extends Express.Request {
  params: {
    id: string;
  };
  body: {
    userInfo: IUserInfo;
  };
}

export interface IOrderSearchFormatted {
  orderId: number;
  userId: number;
  transaction?: Transaction;
  isAdmin?: boolean;
}

export interface IOrderSucessUpdate {
  orderId: number;
  userId: number;
  status: string;
}

export interface IOrderFailedUpdate {
  orderId: number;
  userId: number;
  status: string;
}

export interface IOrderUpdate {
  orderId: number;
  userId: number;
  status: string;
}

export interface IOrderValidatePlan {
  userId: number;
  cinemaPlan: string;
  orderTotals: PriceUnitAndTypeTotals;
}

export interface IOrdersDetails {
  id: number;
  userId: number;
  status: string;
  paymentId: string;
  totalPrice: number;
  totalUnits: number;
  totalConsumables: number;
  totalTickets: number;
  expireAt: Date;
  createdAt: Date;
  updatedAt: Date;
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
  vouchersOrderUnpaid: VouchersAvailableModel[];
  vouchersOrderPaid: VouchersUserModel[];
};

export type IOrderValidateMonth = OrdersModel & {
  productsDetails: OrdersProductsModel & {
    productInfo: EstablishmentsProductsModel;
  }[];
};

export interface IOrderRequestRaw {
  productId: string | number;
  amountRequested: string | number;
}

export interface IOrderRequestFormatted {
  productId: number;
  // packId: number;
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
  cinemaPlan: string;
  orderInfo: IOrderRequestFormatted[];
}

export interface ICreateOrderParams {
  productId: number;
  userId: number;
  amountRequested: number;
}
