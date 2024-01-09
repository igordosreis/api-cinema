import { z } from 'zod';
import { IVoucherAvailable } from './IVouchers';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';

export interface IProduct {
  id: number;
  establishmentId: number;
  active: boolean;
  name: string;
  description: string;
  image: string | null;
  price: number;
  rules: string;
  type: number;
  isAvailable?: boolean;
}

export const IProductRawQuerySchema = z.object({
  establishmentId: z.string().optional(),
  type: z.string().optional(),
  active: z.string().optional(),
  available: z.string().optional(),
  term: z.string().optional(),
});

export type IProductRawQuery = z.infer<typeof IProductRawQuerySchema>;

export const IProductQuerySchema = z.object({
  limit: z.number(),
  page: z.number(),
  establishmentId: z.number().optional(),
  type: z.number().optional(),
  active: z.boolean().optional(),
  available: z.boolean().optional(),
  term: z.string().optional(),
});

export type IProductQuery = z.infer<typeof IProductQuerySchema>;

export interface IProductWithVouchers extends IProduct {
  vouchersAvailable: IVoucherAvailable[];
}

export interface IProductWithRequestedVouchers extends IProduct {
  vouchersRequested: IVoucherAvailable[];
}

export type IProductFromGetById = EstablishmentsProductsModel & {
  vouchersAvailable: Array<VouchersAvailableModel>;
};
