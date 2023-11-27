// import { Request } from 'express';
import {
  IEstablishmentFormattedQuery,
  IEstablishmentRawQuery,
} from '../interfaces/IEstablishments';
import { IProductFormattedQuery, IProductRawQuery } from '../interfaces/IProducts';

class FormatRequestQuery {
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

  formatTerm = ({ query: { term } }: IProductRawQuery) =>
    ((typeof term === 'string') ? term.toLowerCase() : undefined);

  formatType = ({ query: { type } }: IProductRawQuery) =>
    ((typeof type === 'string') ? type.toLowerCase() : undefined);

  formatEstablishmentId = ({ query: { establishmentId } }: IProductRawQuery) => 
    Number(establishmentId) || undefined;

  formatAvailable = ({ query: { available } }: IProductRawQuery) =>
    ((available === 'true') ? true : undefined); 

  formatProductQuery = (req: IProductRawQuery): IProductFormattedQuery => 
    ({
      term: this.formatTerm(req),
      type: this.formatType(req),
      establishmentId: this.formatEstablishmentId(req),
      available: this.formatAvailable(req),
    });
}

export default new FormatRequestQuery();
