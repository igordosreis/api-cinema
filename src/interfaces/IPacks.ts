import { z } from 'zod';
import PacksModel from '../database/models/Packs.model';
import PacksProductsModel from '../database/models/PacksProducts.model';

export type IPackSummary = PacksModel & {
  packInfo: PacksProductsModel[];
};

export const IPackSearchQueryRawSchema = z.object({
  term: z.string().optional(),
  type: z.string().optional(),
  establishmentId: z.string().optional(),
  available: z.string().optional(),
  active: z.string().optional(),
});

export type IPackSearchQueryRaw = z.infer<typeof IPackSearchQueryRawSchema>;

export const IPackSearchQuerySchema = z.object({
  term: z.string().optional(),
  type: z.number().optional(),
  establishmentId: z.number().optional(),
  available: z.boolean().optional(),
  active: z.boolean().optional(),
});

export type IPackSearchQuery = z.infer<typeof IPackSearchQuerySchema>;
