/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
import sequelize, { Op } from 'sequelize';
import EstablishmentsImagesModel from '../database/models/EstablishmentsImages.model';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import ProductsTypesModel from '../database/models/ProductsTypes.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import { IProductCreateInfo, IProductQuery, IProductResult } from '../interfaces/IProducts';
import createProductSearchSqlizeQueryUtil from '../utils/createProductSearchSqlizeQuery.util';
import CustomError, { createProductError, establishmentServiceUnavailable } from '../utils/customError.util';
import EstablishmentsModel from '../database/models/Establishments.model';
import PaginationUtil from '../utils/pagination.util';
import { CONSOLE_LOG_ERROR_TITLE } from '../constants';
import TagsProductsModel from '../database/models/TagsProducts.model';
import ImageFormatter from '../utils/formatImages.util';
import DashboardUtil from '../utils/dashboard.util';
import db from '../database/models';
import TagsModel from '../database/models/Tags.model';

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
          exclude: [
            'type',
            'soldOutAmount',
            'active',
            'purchasable',
            'createdAt',
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
            model: EstablishmentsModel,
            as: 'brand',
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
          },
          {
            model: EstablishmentsImagesModel,
            as: 'imagesBrand',
            attributes: {
              exclude: [
                'establishmentId',
                'imageCarousel',
                'resizeColor',
                'createdAt',
                'updatedAt',
              ],
            },
          },
          {
            model: ProductsTypesModel,
            as: 'typeInfo',
            attributes: {
              exclude: [
                'createdAt',
                'updatedAt',
              ],
            },
          },
          {
            model: TagsProductsModel,
            as: 'tagsProducts',
            attributes: {
              exclude: [
                'productId',
              ],
            },
            include: [
              {
                model: TagsModel,
                as: 'productTags',
                attributes: {
                  exclude: [
                    'id',
                    'createdAt',
                    'updatedAt',
                  ],
                },
              },
            ],
          },
        ],
        group: [
          'establishments_products.product_id',
          'tagsProducts.tag_id',
          'tagsProducts.product_id',
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
      const pagedProducts = PaginationUtil.getPageContent({ page, limit, array: filteredProducts })
        .map((product) => {
          const { imagesBrand: { logo, cover } } = product;
          
          const newImagesBrand = {
            logo: ImageFormatter.formatUrl({ imageName: logo, folderPath: '/establishments/logo' }),
            cover: ImageFormatter.formatUrl({ imageName: cover, folderPath: '/establishments/cover' }),
          };

          return {
            ...product.dataValues,
            imagesBrand: {
              ...newImagesBrand,
            },
          } as IProductResult;
        });

      return pagedProducts;
    } catch (error: CustomError | unknown) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);
      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }

  public static async getProductsTypes() {
    try {
      const productTypes = await ProductsTypesModel.findAll();

      const productTypesWithImgLinks = productTypes.map((type) => ({
        ...type.dataValues,
        icon: ImageFormatter.formatUrl({ imageName: type.icon, folderPath: '/product-types' }),
      }));

      return productTypesWithImgLinks;
    } catch (error: CustomError | unknown) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);
      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }

  public static async createProduct(newProductInfo: IProductCreateInfo) {
    const t = await db.transaction();
    try {
      const { tags, type, ...restOfInfo } = newProductInfo;
      
      const { productId } = await EstablishmentsProductsModel.create({ ...restOfInfo, type }, { transaction: t });

      const formattedTagsArray = DashboardUtil.formatTagsArrayWithIds({ tags, productId });
      await TagsProductsModel.bulkCreate(formattedTagsArray, { transaction: t });

      await t.commit();

      return productId;
    } catch (error) {
      await t.rollback();
      
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(createProductError);
    }
  }
}
