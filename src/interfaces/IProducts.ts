import { Request } from 'express';
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
  type: string | null;
  isAvailable?: boolean;
}

export interface IProductRawQuery extends Request {
  term: string | undefined;
  available: boolean | undefined;
  type: string | undefined;
  establishmentId: number | undefined;
}

export interface IProductFormattedQuery {
  term: string | undefined;
  available: boolean | undefined;
  type: string | undefined;
  establishmentId: number | undefined;
}

export interface IProductWithVouchers extends IProduct {
  vouchersAvailable: IVoucherAvailable[];
}

export interface IProductWithSelectedVouchers extends IProduct {
  vouchersSelected: IVoucherAvailable[];
}

export type IProductFromGetById = EstablishmentsProductsModel & {
  vouchersAvailable: Array<VouchersAvailableModel>;
};
