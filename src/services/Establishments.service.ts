/* eslint-disable max-lines-per-function */
import { QueryTypes } from 'sequelize';
import db from '../database/models';
import CitiesModel from '../database/models/Cities.model';
import EstablishmentsModel from '../database/models/Establishments.model';
import StatesModel from '../database/models/States.model';
import createGeoSearchSqlQuery from '../utils/createGeoSearchSqlQuery.util';
import { IAddress, IEstablishmentAddressQuery } from '../interfaces/IEstablishments';
import EstablishmentsImagesModel from '../database/models/EstablishmentsImages.model';
import CustomError, { establishmentServiceUnavailable } from '../utils/customError.util';
import { CONSOLE_LOG_ERROR_TITLE } from '../constants';
import ImageFormatter from '../utils/formatImages.util';

export default class EstablishmentsService {
  public static async getAllEstablishments(): Promise<EstablishmentsModel[]> {
    try {
      const allEstablishments = await EstablishmentsModel.findAll({
        include: [{ model: EstablishmentsImagesModel, as: 'images' }],
      });

      return allEstablishments;
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
        const { image, cover } = address;
        const addressWithImages = {
          ...address,
          image: ImageFormatter.formatUrl({ imageName: image, folderPath: '/establishments/logo' }),
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
}
