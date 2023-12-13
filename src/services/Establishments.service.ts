/* eslint-disable max-lines-per-function */
import sequelize, { QueryTypes, Op } from 'sequelize';
import db from '../database/models';
import CitiesModel from '../database/models/Cities.model';
import EstablishmentsModel from '../database/models/Establishments.model';
import StatesModel from '../database/models/States.model';
import createGeoSearchSqlQuery from '../utils/createGeoSearchSqlQuery.util';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import { IProductFormattedQuery } from '../interfaces/IProducts';
import { IEstablishmentFormattedQuery } from '../interfaces/IEstablishments';
import createProductSearchSqlizeQueryUtil from '../utils/createProductSearchSqlizeQuery.util';
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
  }: IEstablishmentFormattedQuery) {
    try {
      const filteredAddresses = await db.query(
        createGeoSearchSqlQuery({ term, cityId, stateId, brandId }),
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
    } catch (error: CustomError | unknown) {
      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }

  public static async getProductsByQuery(formattedQuery: IProductFormattedQuery) {
    try {
      const filteredProducts = await EstablishmentsProductsModel.findAll({
        attributes: {
          include: [
            [sequelize.fn('COUNT', sequelize.col('vouchersAvailable.id')), 'vouchersQuantity'],
            [
              sequelize.literal(
                'COUNT(vouchersAvailable.id) > establishments_products.sold_out_amount',
              ),
              'isAvailable',
            ],
          ],
        },
        include: [
          {
            model: VouchersAvailableModel,
            attributes: [],
            as: 'vouchersAvailable',
            where: {
              orderId: null,
              expireAt: {
                [Op.gt]: new Date(),
              },
            },
          },
          {
            model: EstablishmentsImagesModel,
            as: 'imagesBrand',
          },
        ],
        group: ['establishments_products.id'],
        where: createProductSearchSqlizeQueryUtil.create(formattedQuery),
      });

      return filteredProducts;
    } catch (error: CustomError | unknown) {
      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }
}
