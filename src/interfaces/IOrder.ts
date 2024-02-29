import { z } from 'zod';
import { Transaction } from 'sequelize';
import { IUserInfo } from './IUser';
import OrdersModel from '../database/models/Orders.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import VouchersUserModel from '../database/models/VouchersUser.model';
import OrdersProductsModel from '../database/models/OrdersProducts.model';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import { IPackSummary } from './IPacks';
import { IProductWithRequestedVouchers } from './IProducts';
import OrdersPacksModel from '../database/models/OrdersPacks.model';
import PacksModel from '../database/models/Packs.model';
import EstablishmentsModel from '../database/models/Establishments.model';
import EstablishmentsImagesModel from '../database/models/EstablishmentsImages.model';
import ProductsTypesModel from '../database/models/ProductsTypes.model';

// type TypesStrings = 'ticket' | 'consumable';
// export type ProductsTypesStrings = Record<TypesStrings, string>;

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
  status?: string;
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

export type IOrderRequestInfo = {
  establishmentId: number;
  productId: number;
  amountRequested: number;
  price?: number;
} | {
  establishmentId: number;
  packId: number;
  amountRequested: number;
  price?: number;
};
// export interface IOrderRequestInfo {
//   productId?: number | undefined;
//   packId?: number | undefined;
//   amountRequested: number;
//   price?: number;
// }

export interface IOrderRequestRawBody {
  // orderInfo: IOrderRequestRawInfo[];
  userInfo: IUserInfo;
}

export interface IOrderRequestBody {
  userId: number;
  companyId: number;
  cinemaPlan: number;
  // orderInfo: IOrderRequestInfo[];
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

export type IParsedOrder =
  | {
    productId: number;
    amountRequested: number;
    pack?: undefined;
  }
  | {
    pack: IPackSummary;
    amountRequested: number;
    productId?: undefined;
  };

export interface IProductWithRequestedVouchersWithAmount extends IProductWithRequestedVouchers {
  amountRequested: number;
}

export type IParsedOrderWithProducts =
  | {
    pack: IPackSummary;
    amountRequested: number;
    // productId?: undefined;
  }
  | IProductWithRequestedVouchersWithAmount;
  
export type IOrderInfo = OrdersModel & {
  vouchersOrderUnpaid: VouchersAvailableModel[];
  vouchersOrderPaid: VouchersUserModel[];
  productsDetails: Array<OrdersProductsModel & {
    productInfo: EstablishmentsProductsModel;
  }>
  packDetails: Array<OrdersPacksModel & {
    packOrder: PacksModel;
  }>
};

export type IOrderDetailsById = OrdersModel & {
  vouchersOrderUnpaid: VouchersAvailableModel[];
  vouchersOrderPaid: VouchersUserModel[];
  productsDetails: Array<OrdersProductsModel & {
    productInfo: EstablishmentsProductsModel;
  }>
  packDetails: Array<OrdersPacksModel & {
    packOrder: PacksModel;
  }>
};

export type IOrderAll = OrdersModel & {
  establishmentInfo: EstablishmentsModel & {
    images: EstablishmentsImagesModel;
  }
  vouchersOrderPaid: Array<VouchersUserModel & {
    productVoucherInfo: EstablishmentsProductsModel & {
      typeInfo: ProductsTypesModel;
    };
  }>
};

export type IOrderParsed = OrdersModel & {
  establishmentInfo: EstablishmentsModel & {
    images: EstablishmentsImagesModel;
  }
  vouchersByType: Array<IVouchersByType>,
};

export type IVouchersByType = {
  vouchersInfo: Array<IVoucherInfo>,
  typeInfo: ProductsTypesModel;
};

export type IVoucherInfo = VouchersUserModel & {
  productVoucherInfo: EstablishmentsProductsModel,
};

// export type IProductTypes = 'tickets' | 'consumables';

// export type IOrderParsed = IOrderAllParsedGeneric<IProductTypes>;

// export type VoucherInfo<T extends string> = {
//   [key in T]: Array<VouchersUserModel & {
//     productVoucherInfo: EstablishmentsProductsModel & {
//       typeInfo: ProductsTypesModel;
//     },
//   }>;
// };

// type IOrderAllParsedGeneric<T extends IProductTypes> = OrdersModel & {
//   establishmentInfo: EstablishmentsModel & {
//     images: EstablishmentsImagesModel;
//   };
//   vouchersInfo: {
//     [key in T]: VoucherInfo<key>;
//   };
// };

export type ICurrVoucher = VouchersUserModel & {
  productVoucherInfo: EstablishmentsProductsModel & {
    typeInfo: ProductsTypesModel;
  };
};

export const IOrderStatusSchema = z.union([
  z.literal('all'),
  z.literal('paid'),
  z.literal('unpaid'),
  z.literal('expired'),
  z.literal('canceled'),
]);

export type IOrderStatus = z.infer<typeof IOrderStatusSchema>;

export const IOrderAllRequestSchema = z.object({
  page: z.string(),
  limit: z.string(),
  year: z.string(),
  month: z.string(),
  status: IOrderStatusSchema.optional(),
});

export type IOrderAllRequest = z.infer<typeof IOrderAllRequestSchema>;