/* eslint-disable max-lines-per-function */
import { QueryTypes } from 'sequelize';
import db from '../database/models';
import CitiesModel from '../database/models/Cities.model';
import EstablishmentsModel from '../database/models/Establishments.model';
import StatesModel from '../database/models/States.model';
import createGeoSearchSqlQuery from '../utils/createGeoSearchSqlQuery.util';
import { IEstablishmentAddressQuery } from '../interfaces/IEstablishments';
import EstablishmentsImagesModel from '../database/models/EstablishmentsImages.model';
import CustomError, { establishmentServiceUnavailable } from '../utils/customError.util';

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
    brandId,
    term,
  }: IEstablishmentAddressQuery) {
    try {
      const filteredAddresses = await db.query(
        createGeoSearchSqlQuery({ term, cityId, stateId, brandId }),
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
            brandId,
          },
        },
      );

      return filteredAddresses;
    } catch (error: CustomError | unknown) {
      console.log('--- - -- -- -- - - --  - - -- - -- - ---- -- -- - --- - - - -error: ', error);
      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }
}
