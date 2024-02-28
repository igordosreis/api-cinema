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
  purchasable: boolean;
  name: string;
  description: string;
  image: string | null;
  price: number;
  rules: string;
  type: number;
  available?: boolean;
  soldOutAmount: number;
  expireAt: Date;
}

// export interface IProductCreateInfo {
//   establishmentId: number;
//   active: boolean;
//   purchasable: boolean;
//   name: string;
//   description: string;
//   image: string;
//   price: number;
//   rules: string;
//   type: number;
//   soldOutAmount: number;
//   expireAt: Date;
//   tags: number[];
// }

export const IProductCreateInfoSchema = z
  .object({
    establishmentId: z.number(),
    active: z.boolean().optional(),
    purchasable: z.boolean().optional(),
    name: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    price: z.number(),
    rules: z.string().optional(),
    type: z.number(),
    soldOutAmount: z.number(),
    expireAt: z.string().pipe(z.coerce.date()).optional(),
    tags: z.array(z.number()),
  })
  .strict();

export type IProductCreateInfo = z.infer<typeof IProductCreateInfoSchema>;

export interface IProductCreateInfoBody {
  productInfo: IProductCreateInfo;
}

export const IProductEditInfoSchema = z
  .object({
    productId: z.number(),
    establishmentId: z.number().optional(),
    active: z.boolean().optional(),
    purchasable: z.boolean().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    price: z.number().optional(),
    rules: z.string().optional(),
    type: z.number().optional(),
    soldOutAmount: z.number().optional(),
    expireAt: z.string().pipe(z.coerce.date()).optional(),
    tags: z.array(z.number()).optional(),
  })
  .strict();

export type IProductEditInfo = z.infer<typeof IProductEditInfoSchema>;

export interface IProductEditInfoBody {
  productInfo: IProductEditInfo;
}

export type IProductResult = EstablishmentsProductsModel & {
  brand: EstablishmentsModel;
  imagesBrand: EstablishmentsImagesModel;
  typeInfo: ProductsTypesModel;
  productTags: Array<TagsProductsModel>;
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
  purchasable: z.boolean().optional(),
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

export const IProductQueryDashboardSchema = z.object({
  limit: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
  establishmentId: z.coerce.number().optional(),
  type: z.union([
    z.literal('pack'),
    z.coerce.number(),
  ]).optional(),
  // type: z.coerce.number().optional(),
  active: z.string().transform((x) => x.toLowerCase() === 'true').pipe(z.boolean()).optional(),
  available: z.string().transform((x) => x.toLowerCase() === 'true').pipe(z.boolean()).optional(),
  term: z.string().optional(),
  tags: z.string().transform((tagsString, ctx) => {
    const parsedNumbersArray = tagsString.split(',').map((tag) => {
      const parsedTag = Number(tag);
      if (Number.isNaN(parsedTag)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Not a number',
        });

        return z.NEVER;
      }

      return parsedTag;
    });

    return parsedNumbersArray;
  }).optional(),
  purchasable: z.string().transform((x) => x.toLowerCase() === 'true').pipe(z.boolean()).optional(),
});

export type IProductQueryDashboard = z.infer<typeof IProductQueryDashboardSchema>;
