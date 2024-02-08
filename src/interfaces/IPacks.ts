import { z } from 'zod';
import PacksModel from '../database/models/Packs.model';
import PacksProductsModel from '../database/models/PacksProducts.model';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import EstablishmentsImagesModel from '../database/models/EstablishmentsImages.model';
import ProductsTypesModel from '../database/models/ProductsTypes.model';
import TagsProductsModel from '../database/models/TagsProducts.model';
import TagsPacksModel from '../database/models/TagsPacks.model';
import EstablishmentsModel from '../database/models/Establishments.model';

export type IPackSummary = PacksModel & {
  packInfo: PacksProductsModel[];
};

export const IPackSearchQueryRawSchema = z.object({
  limit: z.string().optional(),
  page: z.string().optional(),
  term: z.string().optional(),
  type: z.string().optional(),
  establishmentId: z.string().optional(),
  available: z.string().optional(),
  active: z.string().optional(),
  tags: z.string().optional(),
});

export type IPackSearchQueryRaw = z.infer<typeof IPackSearchQueryRawSchema>;

export const IPackSearchQuerySchema = z.object({
  limit: z.number(),
  page: z.number(),
  term: z.string().optional(),
  type: z.number().optional(),
  establishmentId: z.number().optional(),
  available: z.boolean().optional(),
  active: z.boolean().optional(),
  tags: z.array(z.number()).optional(),
});

export type IPackSearchQuery = z.infer<typeof IPackSearchQuerySchema>;

export type IPacksByQuery = PacksModel & {
  available?: boolean;
  packTags: Array<TagsPacksModel>,
  brand: EstablishmentsModel,
  brandImages: EstablishmentsImagesModel,
  packInfo: Array<PacksProductsModel & {
    productDetails: EstablishmentsProductsModel & {
      vouchersQuantity: number,
      typeInfo: ProductsTypesModel,
      productTags: Array<TagsProductsModel>,
    };
  }>;
};

export const IProductInPackSchema = z.object({
  productId: z.number(),
  quantity: z.number(),
  price: z.number(),
});

export type IProductInPack = z.infer<typeof IProductInPackSchema>;

export const IPackCreateInfoSchema = z
  .object({
    establishmentId: z.number(),
    active: z.boolean().optional(),
    name: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    price: z.number(),
    rules: z.string().optional(),
    counterLimit: z.number().optional(),
    tags: z.array(z.number()),
    expireAt: z.string().pipe(z.coerce.date()).optional(),
    products: z.array(IProductInPackSchema),
  })
  .strict();

export type IPackCreateInfo = z.infer<typeof IPackCreateInfoSchema>;

export interface IPackCreateInfoBody {
  newPackInfo: IPackCreateInfo;
}