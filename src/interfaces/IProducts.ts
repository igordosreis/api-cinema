import { z } from 'zod';
import { IVoucherAvailable } from './IVouchers';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import EstablishmentsModel from '../database/models/Establishments.model';
import EstablishmentsImagesModel from '../database/models/EstablishmentsImages.model';
import ProductsTypesModel from '../database/models/ProductsTypes.model';
import TagsProductsModel from '../database/models/TagsProducts.model';

export interface IProduct {
  productId: number;
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

export type IProductResult = EstablishmentsProductsModel & {
  brand: EstablishmentsModel,
  imagesBrand: EstablishmentsImagesModel,
  typeInfo: ProductsTypesModel,
  productTags: Array<TagsProductsModel>,
};

export const IProductRawQuerySchema = z.object({
  limit: z.string().optional(),
  page: z.string().optional(),
  establishmentId: z.string().optional(),
  type: z.string().optional(),
  active: z.string().optional(),
  available: z.string().optional(),
  term: z.string().optional(),
  tags: z.string().optional(),
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
  tags: z.array(z.number()).optional(),
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
