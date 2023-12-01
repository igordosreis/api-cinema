import { Request } from 'express';
import { IVoucherAvailable } from './IVouchers';

export interface IProducts {
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

export interface IProductWithVouchers extends IProducts {
  vouchersAvailable: IVoucherAvailable[];
}
