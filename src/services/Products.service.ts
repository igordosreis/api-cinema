/* eslint-disable max-lines-per-function */
import sequelize, { Op } from 'sequelize';
import EstablishmentsImagesModel from '../database/models/EstablishmentsImages.model';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import ProductsTypesModel from '../database/models/ProductsTypes.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import { IProductQuery } from '../interfaces/IProducts';
import createProductSearchSqlizeQueryUtil from '../utils/createProductSearchSqlizeQuery.util';
import CustomError, { establishmentServiceUnavailable } from '../utils/customError.util';
import EstablishmentsModel from '../database/models/Establishments.model';
import Pagination from '../utils/pagination.util';
import { CONSOLE_LOG_ERROR_TITLE } from '../constants';

export default class ProductsService {
  public static async getProductsByQuery(formattedSearchQuery: IProductQuery) {
    try {
      const products = await EstablishmentsProductsModel.findAll({
        attributes: {
          include: [
            [sequelize.fn('COUNT', sequelize.col('vouchersAvailable.id')), 'vouchersQuantity'],
            [
              sequelize.literal(
                'COUNT(vouchersAvailable.id) > establishments_products.sold_out_amount',
              ),
              'available',
            ],
          ],
          exclude: ['type'],
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
            model: EstablishmentsModel,
            as: 'brand',
          },
          {
            model: EstablishmentsImagesModel,
            as: 'imagesBrand',
          },
          {
            model: ProductsTypesModel,
            as: 'typeInfo',
          },
        ],
        group: ['establishments_products.product_id'],
        ...createProductSearchSqlizeQueryUtil.create(formattedSearchQuery),
        // limit: formattedQuery.limit,
        // offset: formattedQuery.limit * formattedQuery.page,
      });

      const { page, limit } = formattedSearchQuery;
      const pagedProducts = Pagination.getPageContent({ page, limit, array: products });

      return pagedProducts;
    } catch (error: CustomError | unknown) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);
      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }

  public static async getProductsTypes() {
    try {
      const allProductsTypes = await ProductsTypesModel.findAll();

      return allProductsTypes;
    } catch (error: CustomError | unknown) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);
      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }
}
