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
  type: number;
  isAvailable?: boolean;
}

export interface IProductRawQuery extends Request {
  term: string | undefined;
  available: boolean | undefined;
  active: boolean | undefined;
  type: string | undefined;
  establishmentId: number | undefined;
}

export interface IProductFormattedQuery {
  term: string | undefined;
  available: boolean | undefined;
  active: boolean | undefined;
  type: string | undefined;
  establishmentId: number | undefined;
}

export interface IProductWithVouchers extends IProduct {
  vouchersAvailable: IVoucherAvailable[];
}

export interface IProductWithRequestedVouchers extends IProduct {
  vouchersRequested: IVoucherAvailable[];
}

export type IProductFromGetById = EstablishmentsProductsModel & {
  vouchersAvailable: Array<VouchersAvailableModel>;
};
