// import { Request } from 'express';
import {
  IEstablishmentFormattedQuery,
  IEstablishmentRawQuery,
} from '../interfaces/IEstablishments';
import { IProductFormattedQuery, IProductRawQuery } from '../interfaces/IProducts';
import { IReserveVoucherFormattedQuery, IReserveVoucherRawQuery } from '../interfaces/IVouchers';

class FormatRequestQuery {
  private formatTerm = ({ query: { term } }: IProductRawQuery | IEstablishmentRawQuery) =>
    ((typeof term === 'string') ? term : undefined);
    
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
    ((typeof type === 'string') ? type : undefined);

  private formatEstablishmentId = ({ query: { establishmentId } }: IProductRawQuery) => 
    Number(establishmentId) || undefined;

  private formatAvailable = ({ query: { available } }: IProductRawQuery) =>
    ((available === 'true') ? true : undefined); 

  formatProductQuery = (req: IProductRawQuery): IProductFormattedQuery => 
    ({
      term: this.formatTerm(req),
      type: this.formatType(req),
      establishmentId: this.formatEstablishmentId(req),
      available: this.formatAvailable(req),
    });

  private formatProductId = ({ query: { productId } }: IReserveVoucherRawQuery) => 
    Number(productId);

  private formatUserId = ({
    body: {
      userInfo: {
        user: { id: userId },
      },
    },
  }: IReserveVoucherRawQuery) => 
    Number(userId);

  private formatAmount = ({ query: { amount } }: IReserveVoucherRawQuery) => 
    Number(amount);
  
  formatReserveVouchersQuery = (
    req: IReserveVoucherRawQuery,
    reserveStatus: boolean,
  ): IReserveVoucherFormattedQuery =>
    ({
      productId: this.formatProductId(req),
      userId: this.formatUserId(req),
      amountRequested: this.formatAmount(req),
      reserveStatus,
    });
}

export default new FormatRequestQuery();
