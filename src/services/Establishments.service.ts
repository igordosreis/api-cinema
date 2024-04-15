/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable max-lines-per-function */
import { QueryTypes } from 'sequelize';
import db from '../database/models';
import CitiesModel from '../database/models/Cities.model';
import EstablishmentsModel from '../database/models/Establishments.model';
import StatesModel from '../database/models/States.model';
import createGeoSearchSqlQuery from '../utils/createGeoSearchSqlQuery.util';
import createNoGeoSearchSqlQuery from '../utils/createNoGeoSearchSqlQuery.util';
import {
  IAddress,
  IAddressWithImages,
  IBannerUniversalEstablishment,
  IEstablishment,
  IEstablishmentAddressGet,
  IEstablishmentAddressQuery,
  IEstablishmentBrandEdit,
  IEstablishmentById,
  IEstablishmentImageEdit,
  IOfferEstablishment,
} from '../interfaces/IEstablishments';
import EstablishmentsImagesModel from '../database/models/EstablishmentsImages.model';
import CustomError, {
  editEstablishmentError,
  editEstablishmentImageError,
  establishmentNotFound,
  establishmentServiceUnavailable,
} from '../utils/customError.util';
import {
  CONSOLE_LOG_ERROR_TITLE,
  FOLDER_PATH_ESTABLISHMENT_COVER,
  FOLDER_PATH_ESTABLISHMENT_LOGO,
} from '../constants';
import ImageFormatter from '../utils/formatImages.util';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import EstablishmentsAddressesModel from '../database/models/EstablishmentsAddresses.model';
import createAddressGetSqlizeQueryUtil from '../utils/createAddressGetSqlizeQuery.util';
import createHighlightSearchSqlQuery from '../utils/createHighlightSearchSqlQuery.util';
import formatMoviesUtil from '../utils/formatMovies.util';

export default class EstablishmentsService {
  public static async getAllEstablishments() {
    try {
      const allEstablishments = (await EstablishmentsModel.findAll({
        include: [{ model: EstablishmentsImagesModel, as: 'images' }],
      })) as IEstablishment[];

      const establishmentsWithImageLinks = allEstablishments.map((establishment) => ({
        ...establishment.dataValues,
        images: {
          ...establishment.images.dataValues,
          logo: ImageFormatter.formatUrl({
            imageName: establishment.images.logo,
            folderPath: FOLDER_PATH_ESTABLISHMENT_COVER,
          }),
          cover: ImageFormatter.formatUrl({
            imageName: establishment.images.cover,
            folderPath: FOLDER_PATH_ESTABLISHMENT_LOGO,
          }),
        },
      })) as IEstablishment[];

      return establishmentsWithImageLinks;
    } catch (error: CustomError | unknown) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }

  public static async getAllCities() {
    try {
      const allCities = await CitiesModel.findAll({
        include: [{ model: StatesModel, as: 'state' }],
        attributes: { exclude: ['stateId'] },
      });

      return allCities;
    } catch (error: CustomError | unknown) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }

  public static async getAllStates() {
    try {
      const allStates = await StatesModel.findAll();

      return allStates;
    } catch (error: CustomError | unknown) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }

  public static async getEstablishmentsByGeolocQuery({
    page,
    limit,
    distance,
    latitude,
    longitude,
    cityId,
    stateId,
    establishmentId,
    addressId,
    term,
    unique,
  }: IEstablishmentAddressQuery) {
    try {
      const addresses = (await db.query(
        createGeoSearchSqlQuery({ term, cityId, stateId, establishmentId, addressId, unique }),
        {
          type: QueryTypes.SELECT,
          replacements: {
            limit,
            offset: page * limit,
            latitude,
            longitude,
            distance,
            cityId,
            stateId,
            establishmentId,
          },
        },
      )) as IAddress[];

      const parsedAddresses = addresses.map((address) => {
        const { logo, cover } = address;
        const addressWithImages = {
          ...address,
          logo: ImageFormatter.formatUrl({
            imageName: logo,
            folderPath: FOLDER_PATH_ESTABLISHMENT_LOGO,
          }),
          cover: ImageFormatter.formatUrl({
            imageName: cover,
            folderPath: FOLDER_PATH_ESTABLISHMENT_COVER,
          }),
        };

        return addressWithImages;
      });

      return parsedAddresses as IAddressWithImages[];
    } catch (error: CustomError | unknown) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }

  public static async getEstablishmentAddressByQueryNoGeoloc({
    page,
    limit,
    cityId,
    stateId,
    establishmentId,
    addressId,
    term,
  }: IEstablishmentAddressQuery) {
    try {
      const addresses = (await db.query(
        createNoGeoSearchSqlQuery({ term, cityId, stateId, establishmentId, addressId }),
        {
          type: QueryTypes.SELECT,
          replacements: {
            limit,
            offset: page * limit,
            cityId,
            stateId,
            establishmentId,
          },
        },
      )) as IAddress[];

      const parsedAddresses = addresses.map((address) => {
        const { logo, cover } = address;
        const addressWithImages = {
          ...address,
          logo: ImageFormatter.formatUrl({
            imageName: logo,
            folderPath: FOLDER_PATH_ESTABLISHMENT_LOGO,
          }),
          cover: ImageFormatter.formatUrl({
            imageName: cover,
            folderPath: FOLDER_PATH_ESTABLISHMENT_COVER,
          }),
        };

        return addressWithImages;
      });

      return parsedAddresses;
    } catch (error: CustomError | unknown) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }

  public static async getEstablishmentHighlights() {
    try {
      const addresses = (await db.query(
        createHighlightSearchSqlQuery(),
        {
          type: QueryTypes.SELECT,
        },
      )) as IAddress[];

      const parsedAddresses = addresses.map((address) => {
        const { logo, cover } = address;
        const addressWithImages = {
          ...address,
          logo: ImageFormatter.formatUrl({
            imageName: logo,
            folderPath: FOLDER_PATH_ESTABLISHMENT_LOGO,
          }),
          cover: ImageFormatter.formatUrl({
            imageName: cover,
            folderPath: FOLDER_PATH_ESTABLISHMENT_COVER,
          }),
        };

        return addressWithImages;
      });

      return parsedAddresses;
    } catch (error: CustomError | unknown) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }

  public static async getEstablishmentById({
    establishmentId,
    latitude,
    longitude,
  }: {
    establishmentId: number;
    latitude: string;
    longitude: string;
  }) {
    try {
      const establishment = (await EstablishmentsModel.findOne({
        attributes: {
          exclude: [
            'link',
            'linkDescription',
            'telephone',
            'telephoneTwo',
            'whatsapp',
            'instagram',
            'keyWords',
            'site',
            'active',
            'underHighlight',
            'views',
            'createdAt',
            'updatedAt',
          ],
        },
        include: [
          {
            model: EstablishmentsImagesModel,
            as: 'images',
            attributes: {
              exclude: [
                'establishmentId',
                'createdAt',
                'updatedAt',
                'resizeColor',
                'imageCarousel',
              ],
            },
          },
          {
            model: EstablishmentsProductsModel,
            as: 'products',
            attributes: {
              exclude: [
                'establishmentId',
                'active',
                'purchasable',
                'image',
                'price',
                'type',
                'soldOutAmount',
                'createdAt',
                'updatedAt',
                'expireAt',
              ],
            },
          },
        ],
        where: { id: establishmentId },
      })) as IEstablishmentById;

      const [address] = await this.getEstablishmentsByGeolocQuery({
        limit: 1,
        page: 0,
        establishmentId,
        distance: 10000,
        latitude,
        longitude,
      });

      const establishmentWithAddress = {
        ...establishment.dataValues,
        images: {
          ...establishment.images.dataValues,
          logo: ImageFormatter.formatUrl({
            imageName: establishment.images.logo,
            folderPath: FOLDER_PATH_ESTABLISHMENT_LOGO,
          }),
          cover: ImageFormatter.formatUrl({
            imageName: establishment.images.cover,
            folderPath: FOLDER_PATH_ESTABLISHMENT_COVER,
          }),
        },
        address,
      };

      return establishmentWithAddress;
    } catch (error: CustomError | unknown) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }

  public static async getEstablishmentOffer(formattedQuery: IEstablishmentAddressQuery) {
    const addresses = await this.getEstablishmentsByGeolocQuery(formattedQuery);

    const cards: IBannerUniversalEstablishment[] = addresses.map((address) => {
      const { distance, establishmentId, logo } = address;

      const banner: IBannerUniversalEstablishment = {
        title: formatMoviesUtil.formatDistance(distance),
        image: logo, 
        sizes: {
          width: 60,
          height: 60,
        },
        action: {
          type: 'internal',
          href: 'CineScreens',
          params: {
            screen: 'cineDetails',
            params: {
              id: establishmentId,
            },
          },
        },
      };

      return banner;
    });

    const offer: IOfferEstablishment = {
      title: 'Cinemas próximos',
      type: 'BallBanner',
      cards,
    };

    return offer;
  }

  public static async getEstablishmentAddressDashboard(addressInfo: IEstablishmentAddressGet) {
    try {
      const addresses = await EstablishmentsAddressesModel.findAll({
        ...createAddressGetSqlizeQueryUtil.create(addressInfo),
      });

      return addresses;
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(editEstablishmentError);
    }
  }

  public static async getEstablishmentByIdDashboard(id: number) {
    try {
      const establishment = await EstablishmentsModel.findByPk(id);

      const isEstablishmentNotFound = !establishment;
      if (isEstablishmentNotFound) throw new CustomError(establishmentNotFound);

      return establishment;
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }

  public static async editEstablishmentBrandDashboard(
    editEstablishmentInfo: IEstablishmentBrandEdit,
  ) {
    const t = await db.transaction();
    try {
      const { id, ...restOfInfo } = editEstablishmentInfo;

      const establishment = await EstablishmentsModel.findByPk(id);

      const isEstablishmentNotFound = !establishment;
      if (isEstablishmentNotFound) throw new CustomError(establishmentNotFound);

      await establishment.update({ ...restOfInfo, transaction: t });

      await t.commit();
    } catch (error) {
      await t.rollback();

      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(editEstablishmentError);
    }
  }

  public static async editImageDashboard(imageInfo: IEstablishmentImageEdit, name: string) {
    try {
      const { establishmentId, imageType } = imageInfo;

      const isCover = imageType === 'cover';
      if (isCover) {
        await EstablishmentsImagesModel.update({ cover: name }, { where: { establishmentId } });
      }

      const isLogo = imageType === 'logo';
      if (isLogo) {
        await EstablishmentsImagesModel.update({ logo: name }, { where: { establishmentId } });
      }
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(editEstablishmentImageError);
    }
  }

  public static async getAllEstablishmentsDashboard() {
    try {
      const allEstablishments = (await EstablishmentsModel.findAll({
        include: [{ model: EstablishmentsImagesModel, as: 'images' }],
      })) as IEstablishment[];

      const establishmentsWithImageLinks = allEstablishments.map((establishment) => ({
        ...establishment.dataValues,
        images: {
          ...establishment.images.dataValues,
          logo: ImageFormatter.formatUrl({
            imageName: establishment.images.logo,
            folderPath: FOLDER_PATH_ESTABLISHMENT_LOGO,
          }),
          cover: ImageFormatter.formatUrl({
            imageName: establishment.images.cover,
            folderPath: FOLDER_PATH_ESTABLISHMENT_COVER,
          }),
        },
      })) as IEstablishment[];

      return establishmentsWithImageLinks;
    } catch (error: CustomError | unknown) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }
}
