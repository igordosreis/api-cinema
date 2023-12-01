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
import { MINIMUM_PRODUCT_QUANTITY } from '../constants';

export default class EstablishmentsService {
  public static async getAllEstablishments(): Promise<EstablishmentsModel[]> {
    const allEstablishments = EstablishmentsModel.findAll({
      include: [{ model: EstablishmentsImagesModel, as: 'images' }],
    });

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
  }

  public static async getProductsByQuery(formattedQuery: IProductFormattedQuery) {
    const filteredProducts = await EstablishmentsProductsModel.findAll({
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('vouchersAvailable.id')), 'vouchersQuantity'],
          [
            sequelize.literal(`COUNT(vouchersAvailable.id) > ${MINIMUM_PRODUCT_QUANTITY}`),
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
            reserved: 0,
            expireDate: {
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
  }
}
