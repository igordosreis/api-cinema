import { z } from 'zod';
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
  vouchersOrderPaid: Array<
  VouchersUserModel & {
    productVoucherInfo: EstablishmentsProductsModel;
  }
  >;
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

export const IVouchersNewSchema = z.object({
  voucherCode: z.string(),
});

export const IVouchersNewArraySchema = z.array(
  z.object({
    voucherCode: z.string(),
  }),
);

export type IVouchersNew = z.infer<typeof IVouchersNewSchema>;

export interface IVouchersNewInBody {
  vouchers: IVouchersNew;
}

export const IVoucherNewParamsRawSchema = z.object({
  date: z.string(),
  productId: z.string(),
  establishmentId: z.string(),
  batchId: z.string(),
});

export type IVoucherNewParamsRaw = z.infer<typeof IVoucherNewParamsRawSchema>;

export const IVoucherNewParamsSchema = z.object({
  date: z.string().pipe(z.coerce.date()),
  productId: z.string().pipe(z.coerce.number()),
  establishmentId: z.string().pipe(z.coerce.number()),
  batchId: z.string(),
});

export type IVoucherNewParams = z.infer<typeof IVoucherNewParamsSchema>;

export interface IVouchersCreateInfo {
  date: Date;
  productId: number;
  establishmentId: number;
  batchId: string;
  voucherCodes: IVouchersNew[];
}
export const IVouchersInfoArraySchema = z.array(
  z.object({
    expireAt: z.date(),
    productId: z.number(),
    establishmentId: z.number(),
    batchId: z.string(),
    voucherCode: z.string(),
  }),
);

export type IVouchersInfoArray = z.infer<typeof IVouchersInfoArraySchema>;

export const VoucherTypeSchema = z
  .union([z.literal('available'), z.literal('user'), z.literal('withdraw')])
  .optional();

export const IVouchersGetDashboardSchema = z.object({
  establishmentId: z.coerce.number().optional(),
  productId: z.coerce.number().optional(),
  voucherType: VoucherTypeSchema,
  search: z.string().optional(),
});

export type IVouchersGetDashboard = z.infer<typeof IVouchersGetDashboardSchema>;

export const IVoucherSingleWithdrawSchema = z.object({
  voucherCode: z.string(),
  soldPrice: z.string().pipe(z.coerce.number()).optional(),
  // productId: z.number(),
});

export type IVoucherSingleWithdraw = z.infer<typeof IVoucherSingleWithdrawSchema>;
