/* eslint-disable max-lines-per-function */
import { QueryTypes } from 'sequelize';
import sequelize from '../database/models';
import CitiesModel from '../database/models/Cities.model';
import EstablishmentsModel from '../database/models/Establishments.model';
import StatesModel from '../database/models/States.model';
import { IEstablishmentFormattedQuery } from '../interfaces/IEstablishments';
import GeolocationWithAddressQuery from '../utils/geoQueryWithAddress.util';

export default class EstablishmentService {
  public static async getAllEstablishments(): Promise<EstablishmentsModel[]> {
    const allEstablishments = EstablishmentsModel.findAll();

    return allEstablishments;
  }

  public static async getAllCities() {
    const allCities = CitiesModel.findAll({
      include: [{ model: StatesModel, as: 'state' }],
      attributes: { exclude: ['stateId'] },
    });

    return allCities;
  }

  public static async getAllStates() {
    const allStates = StatesModel.findAll();

    return allStates;
  }

  public static async getEstablishmentsByAddress({
    page,
    limit,
    distance,
    latitude,
    longitude,
    cityId,
    stateId,
    term,
  }: IEstablishmentFormattedQuery) {
    const filteredAddresses = sequelize.query(
      GeolocationWithAddressQuery({ term, cityId, stateId }),
      { type: QueryTypes.SELECT,
        replacements: {
          latitude,
          longitude,
          limit: Number(limit),
          offset: page * limit,
          distance,
          cityId,
          stateId,
        },
      },
    );

    return filteredAddresses;
  }
}
