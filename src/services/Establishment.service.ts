/* eslint-disable max-lines-per-function */
import sequelize, { QueryTypes } from 'sequelize';
import db from '../database/models';
import CitiesModel from '../database/models/Cities.model';
import EstablishmentsModel from '../database/models/Establishments.model';
import StatesModel from '../database/models/States.model';
import { IEstablishmentFormattedQuery } from '../interfaces/IEstablishments';
import GeolocationWithAddressQuery from '../utils/geoQueryWithAddress.util';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';

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
    brandId,
    term,
  }: IEstablishmentFormattedQuery) {
    const filteredAddresses = db.query(
      GeolocationWithAddressQuery({ term, cityId, stateId, brandId }),
      {
        type: QueryTypes.SELECT,
        replacements: {
          limit: Number(limit),
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
  }

  public static async getAllProducts() {
    const allProducts = await EstablishmentsProductsModel.findAll({
      attributes: {
        include: [[sequelize.fn('COUNT', sequelize.col('vouchers_available.id')), 'count']],
      },
      include: [
        {
          model: VouchersAvailableModel,
          attributes: [],
          as: 'product',
        },
      ],
    });

    return allProducts;
  }
}
