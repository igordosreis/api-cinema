// import { Request } from 'express';
import {
  IEstablishmentFormattedQuery,
  IEstablishmentRawQuery,
} from '../interfaces/IEstablishments';

class FormatQueryRequest {
  formatLimit = ({ query: { limit } }: IEstablishmentRawQuery) => {
    const numberLimit = Number(limit);
    console.log('numberLimit: ', numberLimit);
    if (!Number.isNaN(numberLimit) && numberLimit >= 0) return numberLimit;
    return 20;
  };

  formatPage = ({ query: { page } }: IEstablishmentRawQuery) => {
    const numberPage = Number(page);
    if (!Number.isNaN(numberPage) && numberPage >= 0) return numberPage;
    return 0;
  };

  // formatDistance = ({ query: { distance, cityId, stateId } }: IEstablishmentRawQuery) => {
  //   const result = !Number(distance) || cityId || stateId ? 10000 : Number(distance);
  //   console.log('result: ', result);
  //   return result;
  // };
  formatDistance = ({ query: { distance, cityId, stateId } }: IEstablishmentRawQuery) =>
    (!Number(distance) || cityId || stateId ? 10000 : Number(distance));

  formatCityId = ({ query: { cityId } }: IEstablishmentRawQuery) => Number(cityId) || undefined;

  formatStateId = ({ query: { stateId } }: IEstablishmentRawQuery) => Number(stateId) || undefined;

  formatLatitude = ({ query: { latitude } }: IEstablishmentRawQuery) => latitude || '-19.919052';

  formatLongitude = ({ query: { longitude } }: IEstablishmentRawQuery) =>
    longitude || '-43.9386685';

  formatBrandId = ({ query: { brandId } }: IEstablishmentRawQuery) => Number(brandId) || undefined;

  formatEstablishmentQuery = (req: IEstablishmentRawQuery) =>
    ({
      limit: this.formatLimit(req),
      page: this.formatPage(req),
      cityId: this.formatCityId(req),
      stateId: this.formatStateId(req),
      brandId: this.formatBrandId(req),
      term: req.query.term as string,
      distance: this.formatDistance(req),
      latitude: this.formatLatitude(req),
      longitude: this.formatLongitude(req),
    } as IEstablishmentFormattedQuery);
}

export default new FormatQueryRequest();
