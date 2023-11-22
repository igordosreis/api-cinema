import { Request } from 'express';

export interface IEstablishmentAddress {
  id: number;
  name: string;
  establishmentId: number;
  cityId: number;
  active: boolean;
  address: string;
  latitude: string;
  longitude: string;
  telephone: string | null;
  code: number;
}

export interface IEstablishmentRawQuery extends Request {
  page: number | string;
  limit: number | string;
  distance: number | string;
  latitude: string | undefined;
  longitude: string | undefined;
  cityId: string;
  stateId: string;
  term: string;
}

export interface IEstablishmentFormattedQuery {
  limit: number;
  page: number;
  distance: number;
  latitude: string | undefined;
  longitude: string | undefined;
  cityId: number | undefined;
  stateId: number | undefined;
  term: string;
}
