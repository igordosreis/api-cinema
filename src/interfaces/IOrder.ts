import { Request } from 'express';
import { Transaction } from 'sequelize';
import { IUserInfo } from './IUser';
// import { IVoucherAvailable, IVoucherUser } from './IVouchers';
import OrdersModel from '../database/models/Orders.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import VouchersUserModel from '../database/models/VouchersUser.model';
import OrdersProductsModel from '../database/models/OrdersProducts.model';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import { IPackSummary } from './IPacks';
import { IProductWithRequestedVouchers } from './IProducts';

export type TypeId = number;
type Totals = 'totalPrice' | 'totalUnits' | TypeId;
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
  cinemaPlan: number;
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

export type IOrderProductsInMonth = Array<OrdersModel & {
  productsDetails: Array<OrdersProductsModel & {
    productInfo: EstablishmentsProductsModel;
  }>;
}>;

export interface IOrderRequestRawInfo {
  productId?: string | number;
  packId?: string | number;
  amountRequested: string | number;
}

export interface IOrderRequestFormattedInfo {
  productId?: number | undefined;
  packId?: number | undefined;
  amountRequested: number;
  price?: number;
}

export interface IOrderRequestRawBody extends Request {
  body: {
    orderInfo: IOrderRequestRawInfo[];
    userInfo: IUserInfo;
  };
}

export interface IOrderRequestFormattedBody {
  userId: number;
  cinemaPlan: number;
  orderInfo: IOrderRequestFormattedInfo[];
}

export interface ICreateOrderParams {
  productId: number;
  userId: number;
  amountRequested: number;
}

export type IProductsInOrder = {
  productId: number;
  amountRequested: number;
};

export type IParsedOrder = {
  productId: number;
  amountRequested: number;
  pack?: undefined;
} | {
  pack: IPackSummary;
  amountRequested: number;
  productId?: undefined;
};

export type IParsedOrderWithProducts = {
  pack: IPackSummary;
  amountRequested: number;
  productId?: undefined;
} | IProductWithRequestedVouchers;