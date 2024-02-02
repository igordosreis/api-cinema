/* eslint-disable max-lines-per-function */
import { QueryTypes } from 'sequelize';
import db from '../database/models';
import CitiesModel from '../database/models/Cities.model';
import EstablishmentsModel from '../database/models/Establishments.model';
import StatesModel from '../database/models/States.model';
import createGeoSearchSqlQuery from '../utils/createGeoSearchSqlQuery.util';
import {
  IAddress,
  IEstablishment,
  IEstablishmentAddressQuery,
  IEstablishmentById,
} from '../interfaces/IEstablishments';
import EstablishmentsImagesModel from '../database/models/EstablishmentsImages.model';
import CustomError, { establishmentServiceUnavailable } from '../utils/customError.util';
import { CONSOLE_LOG_ERROR_TITLE } from '../constants';
import ImageFormatter from '../utils/formatImages.util';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';

export default class EstablishmentsService {
  public static async getAllEstablishments() {
    try {
      const allEstablishments = await EstablishmentsModel.findAll({
        include: [{ model: EstablishmentsImagesModel, as: 'images' }],
      }) as IEstablishment[];

      const establishmentsWithImageLinks = allEstablishments.map((establishment) => ({
        ...establishment.dataValues,
        images: {
          ...establishment.images.dataValues,
          logo: ImageFormatter.formatUrl({
            imageName: establishment.images.logo,
            folderPath: '/establishments/logo',
          }),
          cover: ImageFormatter.formatUrl({
            imageName: establishment.images.cover,
            folderPath: '/establishments/cover',
          }),
        },
      })) as IEstablishment[];

      return establishmentsWithImageLinks;
    } catch (error: CustomError | unknown) {
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
      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }

  public static async getAllStates() {
    try {
      const allStates = await StatesModel.findAll();

      return allStates;
    } catch (error: CustomError | unknown) {
      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }

  public static async getEstablishmentsByAddress({
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
      const addresses = await db.query(
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
      ) as IAddress[];

      const parsedAddresses = addresses.map((address) => {
        const { logo, cover } = address;
        const addressWithImages = {
          ...address,
          logo: ImageFormatter.formatUrl({ imageName: logo, folderPath: '/establishments/logo' }),
          cover: ImageFormatter.formatUrl({
            imageName: cover,
            folderPath: '/establishments/cover',
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
    establishmentId: number,
    latitude: string,
    longitude: string,
  }) {
    try {
      const establishment = await EstablishmentsModel.findOne({
        include: [
          {
            model: EstablishmentsImagesModel,
            as: 'images',
          },
          {
            model: EstablishmentsProductsModel,
            as: 'products',
          },
        ],
        where: { id: establishmentId },
      }) as IEstablishmentById;

      const [address] = await this.getEstablishmentsByAddress({
        limit: 1,
        page: 0,
        establishmentId,
        distance: 10000,
        latitude,
        longitude,
      });

      // const establishmentsWithImageLinks = allEstablishments.map((establishment) => ({
      //   ...establishment.dataValues,
      //   images: {
      //     ...establishment.images.dataValues,
      //     logo: ImageFormatter.formatUrl({
      //       imageName: establishment.images.logo,
      //       folderPath: '/establishments/logo',
      //     }),
      //     cover: ImageFormatter.formatUrl({
      //       imageName: establishment.images.cover,
      //       folderPath: '/establishments/cover',
      //     }),
      //   },
      // })) as IEstablishment[];

      const establishmentWithAddress = {
        ...establishment.dataValues,
        address,
      };

      return establishmentWithAddress;
    } catch (error: CustomError | unknown) {
      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }
}
