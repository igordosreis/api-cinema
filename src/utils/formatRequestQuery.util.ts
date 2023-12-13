// import { Request } from 'express';
import {
  IEstablishmentFormattedQuery,
  IEstablishmentRawQuery,
} from '../interfaces/IEstablishments';
import { IProductFormattedQuery, IProductRawQuery } from '../interfaces/IProducts';
import {
  IOrderRequestRaw,
  IOrderRequestFormattedBody,
  IOrderRequestRawBody,
  IOrderSearchFormatted, 
  IOrderSearchRaw,
} from '../interfaces/IOrder';

class FormatRequestQuery {
  private formatTerm = ({ query: { term } }: IProductRawQuery | IEstablishmentRawQuery) =>
    (typeof term === 'string' ? term : undefined);

  private formatLimit = ({ query: { limit } }: IEstablishmentRawQuery) => {
    const numberLimit = Number(limit);
    console.log('numberLimit: ', numberLimit);
    if (!Number.isNaN(numberLimit) && numberLimit >= 0) return numberLimit;
    return 20;
  };

  private formatPage = ({ query: { page } }: IEstablishmentRawQuery) => {
    const numberPage = Number(page);
    if (!Number.isNaN(numberPage) && numberPage >= 0) return numberPage;
    return 0;
  };

  private formatDistance = ({ query: { distance, cityId, stateId } }: IEstablishmentRawQuery) =>
    (!Number(distance) || cityId || stateId ? 10000 : Number(distance));

  private formatCityId = ({ query: { cityId } }: IEstablishmentRawQuery) =>
    Number(cityId) || undefined;

  private formatStateId = ({ query: { stateId } }: IEstablishmentRawQuery) =>
    Number(stateId) || undefined;

  private formatLatitude = (req: IEstablishmentRawQuery) =>
    req.query.latitude || req.body.userInfo.location.latitude || '-19.919052';

  private formatLongitude = (req: IEstablishmentRawQuery) =>
    req.query.longitude || req.body.userInfo.location.longitude || '-43.9386685';

  private formatBrandId = ({ query: { brandId } }: IEstablishmentRawQuery) =>
    Number(brandId) || undefined;

  formatEstablishmentQuery = (req: IEstablishmentRawQuery) =>
    ({
      limit: this.formatLimit(req),
      page: this.formatPage(req),
      cityId: this.formatCityId(req),
      stateId: this.formatStateId(req),
      brandId: this.formatBrandId(req),
      term: this.formatTerm(req),
      distance: this.formatDistance(req),
      latitude: this.formatLatitude(req),
      longitude: this.formatLongitude(req),
    } as IEstablishmentFormattedQuery);

  private formatType = ({ query: { type } }: IProductRawQuery) =>
    (typeof type === 'string' ? type : undefined);

  private formatEstablishmentId = ({ query: { establishmentId } }: IProductRawQuery) =>
    Number(establishmentId) || undefined;

  private formatAvailable = ({ query: { available } }: IProductRawQuery) =>
    (available === 'true' ? true : undefined);

  private formatActive = ({ query: { active } }: IProductRawQuery) =>
    (active === 'true' ? true : undefined);

  formatProductQuery = (req: IProductRawQuery): IProductFormattedQuery => ({
    term: this.formatTerm(req),
    type: this.formatType(req),
    establishmentId: this.formatEstablishmentId(req),
    available: this.formatAvailable(req),
    active: this.formatActive(req),
  });

  private formatProductId = (productId: number | string) => Number(productId);

  private formatAmount = (amount: number | string) => Number(amount);

  private formatUserId = ({
    body: {
      userInfo: {
        user: { id: userId },
      },
    },
  }: IOrderRequestRawBody) => Number(userId);

  private formatOrderInfo = ({ body: { orderInfo } }: IOrderRequestRawBody) =>
    orderInfo.map(({ productId, amountRequested }: IOrderRequestRaw) => ({
      productId: this.formatProductId(productId),
      amountRequested: this.formatAmount(amountRequested),
    }));

  formatCreateOrder = (req: IOrderRequestRawBody): IOrderRequestFormattedBody => ({
    userId: this.formatUserId(req),
    cinemaPlan: req.body.userInfo.user.cinemaPlan,
    orderInfo: this.formatOrderInfo(req),
  });

  private convertStringToNumber = (string: string | number): number => Number(string);

  formatOrderSearch = (req: IOrderSearchRaw): IOrderSearchFormatted => ({
    userId: this.convertStringToNumber(req.body.userInfo.user.id),
    orderId: this.convertStringToNumber(req.params.id),
  });
}

export default new FormatRequestQuery();
