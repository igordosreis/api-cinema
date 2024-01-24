/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
import sequelize, { Op } from 'sequelize';
import EstablishmentsImagesModel from '../database/models/EstablishmentsImages.model';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import ProductsTypesModel from '../database/models/ProductsTypes.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import { IProductQuery, IProductResult } from '../interfaces/IProducts';
import createProductSearchSqlizeQueryUtil from '../utils/createProductSearchSqlizeQuery.util';
import CustomError, { establishmentServiceUnavailable } from '../utils/customError.util';
import EstablishmentsModel from '../database/models/Establishments.model';
import Pagination from '../utils/pagination.util';
import { CONSOLE_LOG_ERROR_TITLE } from '../constants';
import TagsProductsModel from '../database/models/TagsProducts.model';

export default class ProductsService {
  public static async getProductsByQuery(formattedSearchQuery: IProductQuery) {
    try {
      const { tags } = formattedSearchQuery;
      const products = await EstablishmentsProductsModel.findAll({
        attributes: {
          include: [
            // [sequelize.fn('COUNT', sequelize.col('vouchersAvailable.id')), 'vouchersQuantity'],
            [
              sequelize.literal(
                'COUNT(vouchersAvailable.id) > establishments_products.sold_out_amount',
              ),
              'available',
            ],
          ],
          exclude: ['type', 'soldOutAmount'],
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
          {
            model: TagsProductsModel,
            as: 'productTags',
          },
        ],
        group: [
          'establishments_products.product_id',
          'productTags.tag_id',
          'productTags.product_id',
        ],
        ...createProductSearchSqlizeQueryUtil.create(formattedSearchQuery),
        // limit: formattedQuery.limit,
        // offset: formattedQuery.limit * formattedQuery.page,
      }) as IProductResult[];

      const filteredProducts = tags
        ? products.filter((product) => tags.every((tag) => product.productTags.some(({ tagId }) => tagId === tag)))
        // ? products.filter((product) => tags.every((tag) => product.productTags.map(({ tagId }) => tagId).includes(tag)))
        : products;

      const { page, limit } = formattedSearchQuery;
      const pagedProducts = Pagination.getPageContent({ page, limit, array: filteredProducts });

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
