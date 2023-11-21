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
