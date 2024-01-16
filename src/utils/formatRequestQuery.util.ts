/* eslint-disable max-len */
/* eslint-disable complexity */
import {
  IEstablishmentAddressQuery,
  IEstablishmentAddressRawQuery,
} from '../interfaces/IEstablishments';
import { IProductQuery, IProductRawQuery } from '../interfaces/IProducts';
import {
  IOrderRequestRawInfo,
  IOrderRequestBody,
  IOrderRequestRawBody,
  IOrderSearchFormatted,
} from '../interfaces/IOrder';
import { IPackSearchQuery, IPackSearchQueryRaw } from '../interfaces/IPacks';
import { IUserInfo } from '../interfaces/IUser';
import { LIMIT_NUMBER_DEFAULT, PAGE_NUMBER_DEFAULT } from '../constants';
import { IPagination, IPaginationRequest } from '../interfaces/IPagination';
import { IMoviesSearchQuery, IMoviesSearchRawQuery } from '../interfaces/IMoviesAPI';
import { ICartAdd, ICartAddRequest } from '../interfaces/ICart';

class FormatRequestQuery {
  private formatTerm = ({ term }: IProductRawQuery | IEstablishmentAddressRawQuery) =>
    (typeof term === 'string' ? term : undefined);

  private formatLimit = ({ limit }: IEstablishmentAddressRawQuery | IPaginationRequest | IProductRawQuery | IPackSearchQueryRaw) => {
    const numberLimit = Number(limit);

    if (!Number.isNaN(numberLimit) && numberLimit >= 0) return numberLimit;
    return LIMIT_NUMBER_DEFAULT;
  };

  private formatPage = ({ page }: IEstablishmentAddressRawQuery | IPaginationRequest | IProductRawQuery | IPackSearchQueryRaw) => {
    const numberPage = Number(page);

    if (!Number.isNaN(numberPage) && numberPage >= 0) return numberPage;
    return PAGE_NUMBER_DEFAULT;
  };

  private formatDistance = ({ distance, cityId, stateId }: IEstablishmentAddressRawQuery) =>
    (!Number(distance) || cityId || stateId ? 10000 : Number(distance));

  private formatCityId = ({ cityId }: IEstablishmentAddressRawQuery) => Number(cityId) || undefined;

  private formatStateId = ({ stateId }: IEstablishmentAddressRawQuery) =>
    Number(stateId) || undefined;

  private formatLatitude = ({
    searchQuery,
    userInfo,
  }: {
    searchQuery: IEstablishmentAddressRawQuery;
    userInfo: IUserInfo;
  }) => searchQuery.latitude || userInfo.location?.latitude || '-19.919052';

  private formatLongitude = ({
    searchQuery,
    userInfo,
  }: {
    searchQuery: IEstablishmentAddressRawQuery;
    userInfo: IUserInfo;
  }) => searchQuery.longitude || userInfo.location?.longitude || '-43.9386685';

  private formatBrandId = ({ establishmentId }: IEstablishmentAddressRawQuery) =>
    Number(establishmentId) || undefined;

  private formatAddressId = ({ addressId }: IEstablishmentAddressRawQuery) => (addressId
    ? addressId.split(',').map((id) => Number(id))
    : undefined);

  private formatUnique = ({ unique }: IEstablishmentAddressRawQuery) => 
    (unique === 'true' ? true : undefined);

  formatEstablishmentQuery = ({
    searchQuery,
    userInfo,
  }: {
    searchQuery: IEstablishmentAddressRawQuery;
    userInfo: IUserInfo;
  }): IEstablishmentAddressQuery => ({
    limit: this.formatLimit(searchQuery),
    page: this.formatPage(searchQuery),
    cityId: this.formatCityId(searchQuery),
    stateId: this.formatStateId(searchQuery),
    establishmentId: this.formatBrandId(searchQuery),
    addressId: this.formatAddressId(searchQuery),
    term: this.formatTerm(searchQuery),
    unique: this.formatUnique(searchQuery),
    distance: this.formatDistance(searchQuery),
    latitude: this.formatLatitude({ searchQuery, userInfo }),
    longitude: this.formatLongitude({ searchQuery, userInfo }),
  });

  private formatType = ({ type }: IProductRawQuery) => Number(type) || undefined;

  private formatEstablishmentId = ({ establishmentId }: IProductRawQuery) =>
    Number(establishmentId) || undefined;

  private formatAvailable = ({ available }: IProductRawQuery) =>
    (available === 'true' ? true : undefined);

  private formatActive = ({ active }: IProductRawQuery) => (active === 'true' ? true : undefined);

  formatProductQuery = (searchQuery: IProductRawQuery): IProductQuery => ({
    limit: this.formatLimit(searchQuery),
    page: this.formatPage(searchQuery),
    term: this.formatTerm(searchQuery),
    type: this.formatType(searchQuery),
    establishmentId: this.formatEstablishmentId(searchQuery),
    available: this.formatAvailable(searchQuery),
    active: this.formatActive(searchQuery),
  });

  private formatProductId = (productId: number | string | undefined) =>
    Number(productId) || undefined;

  private formatPackId = (packId: number | string | undefined) => Number(packId) || undefined;

  private formatAmount = (amount: number | string) => Number(amount);

  private formatUserId = ({
    userInfo: {
      user: { id: userId },
    },
  }: IOrderRequestRawBody) => Number(userId);

  private formatOrderInfo = ({ orderInfo }: IOrderRequestRawBody) =>
    orderInfo.map(({ productId, packId, amountRequested }: IOrderRequestRawInfo) => ({
      productId: this.formatProductId(productId),
      packId: this.formatPackId(packId),
      amountRequested: this.formatAmount(amountRequested),
    }));

  formatCreateOrder = (orderRequest: IOrderRequestRawBody): IOrderRequestBody => ({
    userId: this.formatUserId(orderRequest),
    cinemaPlan: Number(orderRequest.userInfo.user.cinemaPlan),
    orderInfo: this.formatOrderInfo(orderRequest),
  });

  private convertStringToNumber = (string: string | number | undefined): number => Number(string);

  formatOrderSearch = (
    { orderId, userInfo }:
    { orderId: string, userInfo: IUserInfo },
  ): IOrderSearchFormatted => ({
    userId: this.convertStringToNumber(userInfo.user.id),
    orderId: this.convertStringToNumber(orderId),
  });

  // eslint-disable-next-line sonarjs/no-identical-functions
  formatPackQuery = (searchQuery: IPackSearchQueryRaw): IPackSearchQuery => ({
    limit: this.formatLimit(searchQuery),
    page: this.formatPage(searchQuery),
    term: this.formatTerm(searchQuery),
    type: this.formatType(searchQuery),
    establishmentId: this.formatEstablishmentId(searchQuery),
    available: this.formatAvailable(searchQuery),
    active: this.formatActive(searchQuery),
  });

  formatPagination = (paginationRequest: IPaginationRequest): IPagination => ({
    page: this.formatPage(paginationRequest),
    limit: this.formatLimit(paginationRequest),
  });

  formathMoviesSearcQuery = (searchQuery: IMoviesSearchRawQuery): IMoviesSearchQuery => ({
    page: this.formatPage(searchQuery),
    limit: this.formatLimit(searchQuery),
    title: searchQuery.title,
    genreId: Number(searchQuery.genreId) || undefined,
  });

  formatCartAddRequest = ({ cartInfo, userInfo }: ICartAddRequest): ICartAdd => ({
    userId: Number(userInfo.user.id),
    cartInfo,
  });
}

export default new FormatRequestQuery();
