import { z } from 'zod';

// export interface ICartAddRequest {
//   id?: number;
//   category?: 'product' | 'pack';
// }

export const CategorySchema = z.enum(['product', 'pack']);

export const ICartAddRequestSchema = z.object({
  id: z.string(),
  category: CategorySchema,
});

export type ICartAddRequest = z.infer<typeof ICartAddRequestSchema>;

// export interface ICartAdd {
//   id: number;
//   category: 'product' | 'pack';
//   userId: number;
// }

export const ICartAddSchema = z.object({
  userId: z.number(),
  id: z.number(),
  category: CategorySchema,
});

export type ICartAdd = z.infer<typeof ICartAddSchema>;
