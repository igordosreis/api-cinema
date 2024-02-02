import { z } from 'zod';
import EstablishmentsModel from '../database/models/Establishments.model';
import EstablishmentsImagesModel from '../database/models/EstablishmentsImages.model';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';

// export interface IEstablishmentAddressRawQuery {
//   limit: number | string;
//   page: number | string;
//   distance: number | string;
//   latitude: string | undefined;
//   longitude: string | undefined;
//   cityId: string;
//   stateId: string;
//   establishmentId: number | string;
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
//   establishmentId: number | undefined;
//   term: string | undefined;
// }

export type IEstablishment = EstablishmentsModel & {
  images: EstablishmentsImagesModel,
};

export type IEstablishmentById = EstablishmentsModel & {
  images: EstablishmentsImagesModel,
  products: EstablishmentsProductsModel,
  address: {
    logo: string;
    cover: string;
    id: number;
    establishmentId: number;
    latitude: string;
    longitude: string;
    brand: string;
    title: string;
    address: string;
    city: string;
    state: string;
    distance: number;
  },
};

export const IEstablishmentAddressQueryRawSchema = z.object({
  limit: z.string().optional(),
  page: z.string().optional(),
  distance: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  cityId: z.string().optional(),
  stateId: z.string().optional(),
  establishmentId: z.string().optional(),
  addressId: z.string().optional(),
  term: z.string().optional(),
  unique: z.string().optional(),
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
  establishmentId: z.number().optional(),
  addressId: z.array(z.number()).optional(),
  term: z.string().optional(),
  unique: z.boolean().optional(),
});

export type IEstablishmentAddressQuery = z.infer<typeof IEstablishmentAddressQuerySchema>;

export interface IAddress {
  id: number;
  establishmentId: number;
  latitude: string;
  longitude: string;
  brand: string;
  logo: string;
  cover: string;
  title: string;
  address: string;
  city: string;
  state: string;
  distance: number;
}