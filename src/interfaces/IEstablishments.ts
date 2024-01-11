import { z } from 'zod';

// export interface IEstablishmentAddressRawQuery {
//   limit: number | string;
//   page: number | string;
//   distance: number | string;
//   latitude: string | undefined;
//   longitude: string | undefined;
//   cityId: string;
//   stateId: string;
//   brandId: number | string;
//   term: string;
// }

// export interface IEstablishmentFormattedQuery {
//   limit: number;
//   page: number;
//   distance: number;
//   latitude: string | undefined;
//   longitude: string | undefined;
//   cityId: number | undefined;
//   stateId: number | undefined;
//   brandId: number | undefined;
//   term: string | undefined;
// }

export const IEstablishmentAddressQueryRawSchema = z.object({
  limit: z.string().optional(),
  page: z.string().optional(),
  distance: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  cityId: z.string().optional(),
  stateId: z.string().optional(),
  brandId: z.string().optional(),
  addressId: z.string().optional(),
  term: z.string().optional(),
});

export type IEstablishmentAddressRawQuery = z.infer<typeof IEstablishmentAddressQueryRawSchema>;

export const IEstablishmentAddressQuerySchema = z.object({
  limit: z.number(),
  page: z.number(),
  distance: z.number().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  cityId: z.number().optional(),
  stateId: z.number().optional(),
  brandId: z.number().optional(),
  addressId: z.array(z.number()).optional(),
  term: z.string().optional(),
});

export type IEstablishmentAddressQuery = z.infer<typeof IEstablishmentAddressQuerySchema>;
