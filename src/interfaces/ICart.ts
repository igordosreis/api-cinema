import { z } from 'zod';
// import { IUserInfo } from './IUser';

export const ICartOperationRequestSchema = z.union([
  z.object({
    productId: z.string().optional(),
    establishmentId: z.string().optional(),
  }),
  z.object({
    packId: z.string().optional(),
    establishmentId: z.string().optional(),
  }),
]);

export type ICartOperationRequest = z.infer<typeof ICartOperationRequestSchema>;

export const ICartOperationSchema = z.union([
  z.object({
    productId: z.number(),
    establishmentId: z.number(),
    userId: z.number(),
  }),
  z.object({
    packId: z.number(),
    establishmentId: z.number(),
    userId: z.number(),
  }),
]);

export type ICartOperation = z.infer<typeof ICartOperationSchema>;

//

// export const ICartInfoSchema = z.array(
//   z.union([
//     z.object({
//       productId: z.number(),
//       quantity: z.number(),
//     }),
//     z.object({
//       packId: z.number(),
//       quantity: z.number(),
//     }),
//   ]),
// );

// export type ICartInfo = z.infer<typeof ICartInfoSchema>;

// export interface ICartAddRequest {
//   userInfo: IUserInfo;
//   cartInfo: ICartInfo;
// }

// export const ICartAddSchema = z.object({
//   userId: z.number(),
//   cartInfo: ICartInfoSchema,
// });

// export type ICartAdd = z.infer<typeof ICartAddSchema>;

//

// export const CategorySchema = z.enum(['product', 'pack']);

// export const ICartInfoSchema = z.array(
//   z.object({
//     id: z.number(),
//     category: CategorySchema,
//     quantity: z.number(),
//   }),
// );

// export type ICartInfo = z.infer<typeof ICartInfoSchema>;

// export interface ICartAddRequest {
//   userInfo: IUserInfo;
//   cartInfo: ICartInfo;
// }

// export const ICartAddSchema = z.object({
//   userId: z.number(),
//   cartInfo: ICartInfoSchema,
// });

// export type ICartAdd = z.infer<typeof ICartAddSchema>;
