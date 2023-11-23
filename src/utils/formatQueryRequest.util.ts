// import { Request } from 'express';
import {
  IEstablishmentFormattedQuery,
  IEstablishmentRawQuery,
} from '../interfaces/IEstablishments';

class QueryFormat {
  formatLimit = ({ query: { limit } }: IEstablishmentRawQuery) => {
    const numberLimit = Number(limit);
    if (!Number.isNaN(numberLimit) && numberLimit >= 0) return numberLimit;
    return 20;
  };

  formatPage = ({ query: { page } }: IEstablishmentRawQuery) => {
    const numberPage = Number(page);
    if (!Number.isNaN(numberPage) && numberPage >= 0) return numberPage;
    return 0;
  };

  formatDistance = ({ query: { distance, cityId, stateId } }: IEstablishmentRawQuery) => (
    (distance !== undefined && distance !== '') || (cityId || stateId) ? Number(distance) : 10000
  );

  formatCityId = ({ query: { cityId } }: IEstablishmentRawQuery) =>
    Number(cityId) || undefined;

  formatStateId = ({ query: { stateId } }: IEstablishmentRawQuery) =>
    Number(stateId) || undefined;

  formatLatitude = ({ query: { latitude } }: IEstablishmentRawQuery) => latitude || '-19.919052';

  formatLongitude = ({ 
    query: { longitude },
  }: IEstablishmentRawQuery) => longitude || '-43.9386685';

  formatQuery = (req: IEstablishmentRawQuery) => ({
    limit: this.formatLimit(req),
    page: this.formatPage(req),
    distance: this.formatDistance(req),
    cityId: this.formatCityId(req),
    stateId: this.formatStateId(req),
    term: req.query.term as string,
    latitude: this.formatLatitude(req),
    longitude: this.formatLongitude(req),
  }) as IEstablishmentFormattedQuery;
}

export default new QueryFormat();
