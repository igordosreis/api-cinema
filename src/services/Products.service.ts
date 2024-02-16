/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
import sequelize, { Op } from 'sequelize';
import EstablishmentsImagesModel from '../database/models/EstablishmentsImages.model';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import ProductsTypesModel from '../database/models/ProductsTypes.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import { IProductCreateInfo, IProductEditInfo, IProductQuery, IProductResult } from '../interfaces/IProducts';
import createProductSearchSqlizeQueryUtil from '../utils/createProductSearchSqlizeQuery.util';
import CustomError, { createProductError, editProductError, establishmentServiceUnavailable, productNotFound } from '../utils/customError.util';
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

      const packType = {
        id: 'pack',
        name: 'pack',
        appName: 'combo',
      };
      productTypesWithImgLinks.push(packType);

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

  public static async editProduct(editProductInfo: IProductEditInfo) {
    const t = await db.transaction();
    try {
      const { productId, tags, ...restOfInfo } = editProductInfo;

      const product = await EstablishmentsProductsModel.findByPk(productId, { transaction: t });

      const isProductNotFound = !product;
      if (isProductNotFound) throw new CustomError(productNotFound);

      await product.update({ ...restOfInfo });

      const isEditTags = tags?.length;
      if (isEditTags) {
        await TagsProductsModel.destroy({ where: { productId }, transaction: t });

        const formattedTagsArray = DashboardUtil.formatTagsArrayWithIds({ tags, productId });
        await TagsProductsModel.bulkCreate(formattedTagsArray, { transaction: t });
      }

      await t.commit();
    } catch (error) {
      await t.rollback();
      
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(editProductError);
    }
  }
}

// {
//   "adult": false,
//   "backdrop_path": "/uUiIGztTrfDhPdAFJpr6m4UBMAd.jpg",
//   "genre_ids": [
//       {
//           "id": 878,
//           "name": "Ficção científica"
//       },
//       {
//           "id": 28,
//           "name": "Ação"
//       },
//       {
//           "id": 12,
//           "name": "Aventura"
//       }
//   ],
//   "id": 634492,
//   "original_language": "en",
//   "original_title": "Madame Web",
//   "overview": "Depois de sobreviver a um terrível acidente, a paramédica Cassandra Webb começa a desenvolver habilidades de clarividência. Forçada a enfrentar revelações sobre seu passado, ela estabelece um relacionamento com três jovens destinadas a futuros poderosos... se todas conseguirem sobreviver a um presente mortal.",
//   "popularity": 794.984,
//   "poster_path": "https://image.tmdb.org/t/p/w300/zWEm5oy2tE9ku1KSNM089FmZJ2p.jpg",
//   "release_date": "2024-02-15",
//   "title": "Madame Teia",
//   "video": false,
//   "vote_average": 5.635,
//   "vote_count": 89,
//   "isReleased": true,
//   "daysRemainingAsNowPlaying": 29
// },