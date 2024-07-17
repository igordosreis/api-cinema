/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
import sequelize, { Op } from 'sequelize';
import EstablishmentsImagesModel from '../database/models/EstablishmentsImages.model';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import ProductsTypesModel from '../database/models/ProductsTypes.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import { IProductCreateInfo, IProductEditInfo, IProductParsed, IProductQuery, IProductQueryDashboard, IProductResult } from '../interfaces/IProducts';
import createProductSearchSqlizeQueryUtil from '../utils/createProductSearchSqlizeQuery.util';
import CustomError, { cannotCreateTypeError, cannotDeleteTypeError, createProductError, editProductError, establishmentServiceUnavailable, getProductError, nameInUseError, productNotFound, protectedTypeError, typeNotFound } from '../utils/customError.util';
import EstablishmentsModel from '../database/models/Establishments.model';
import PaginationUtil from '../utils/pagination.util';
import { CONSOLE_LOG_ERROR_TITLE } from '../constants';
import TagsProductsModel from '../database/models/TagsProducts.model';
import ImageFormatter from '../utils/formatImages.util';
import db from '../database/models';
import TagsModel from '../database/models/Tags.model';
import TagsUtil from '../utils/tags.util';
import createProductSearchSqlizeQueryDashboardUtil from '../utils/createProductSearchSqlizeQueryDashboard.util';
import BatchesModel from '../database/models/Batches.model';

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
        ? products.filter((product) => tags.every((tag) => product.tagsProducts.some(({ tagId }) => tagId === tag)))
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
        appName: 'Combos',
      };
      productTypesWithImgLinks.push(packType);

      return productTypesWithImgLinks;
    } catch (error: CustomError | unknown) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }

  public static async getProductDetails(productId: number) {
    try {
      const productDetails = await EstablishmentsProductsModel.findByPk(
        productId,
        {
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
        },
      );

      const isProductNotFound = !productDetails;
      if (isProductNotFound) throw new CustomError(productNotFound);

      return productDetails;
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      if (error instanceof CustomError) throw error;

      throw new CustomError(getProductError);
    }
  }

  public static async createProductDashboard(newProductInfo: IProductCreateInfo) {
    const t = await db.transaction();
    try {
      const { tags, type, ...restOfInfo } = newProductInfo;
      
      const { productId } = await EstablishmentsProductsModel.create({ ...restOfInfo, type }, { transaction: t });

      const areTagsProvided = tags && tags.length > 0;
      if (areTagsProvided) {
        const formattedTagsArray = TagsUtil.formatTagsArrayWithIds({ tags, productId });
        await TagsProductsModel.bulkCreate(formattedTagsArray, { transaction: t });
      }

      await t.commit();

      return productId;
    } catch (error) {
      await t.rollback();
      
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(createProductError);
    }
  }

  public static async editProductDashboard(editProductInfo: IProductEditInfo) {
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

        const formattedTagsArray = TagsUtil.formatTagsArrayWithIds({ tags, productId });
        await TagsProductsModel.bulkCreate(formattedTagsArray, { transaction: t });
      }

      await t.commit();
    } catch (error) {
      await t.rollback();
      
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(editProductError);
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  public static async getProductsByQueryDashboard(formattedSearchQuery: IProductQueryDashboard) {
    try {
      const { tags, expireAt } = formattedSearchQuery;
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
          // exclude: [
          //   'type',
          //   'soldOutAmount',
          //   'active',
          //   'purchasable',
          //   'createdAt',
          // ],
        },
        include: [
          {
            model: VouchersAvailableModel,
            attributes: [],
            as: 'vouchersAvailable',
            required: false,
            where: {
              orderId: null,
              expireAt: {
                [Op.gt]: new Date(),
              },
            },
          },
          {
            model: BatchesModel,
            as: 'batchProduct',
            attributes: {
              exclude: [
                'productId',
                // 'createdAt',
                // 'updatedAt',
              ],
            },
            // order: [['createdAt', 'DESC']],
            // limit: 1,
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
          'batchProduct.batch_id',
        ],
        ...createProductSearchSqlizeQueryDashboardUtil.create(formattedSearchQuery),
        // limit: formattedQuery.limit,
        // offset: formattedQuery.limit * formattedQuery.page,
      }) as IProductResult[];

      const parsedProducts = products
        .map(({ dataValues: product }) => {
          const { batchProduct, ...restOfInfo } = product;

          const lastBatch = Array.isArray(batchProduct) && batchProduct.sort((batchA, batchB) => batchA.expireAt - batchB.expireAt)[0];

          const newProductInfo = {
            ...restOfInfo,
            batchProduct: lastBatch,
          };

          return newProductInfo;
        }) as IProductParsed[];

      const filteredByTags = tags
        ? parsedProducts.filter((product) => tags.every((tag) => product.tagsProducts.some(({ tagId }) => tagId === tag)))
        // ? products.filter((product) => tags.every((tag) => product.productTags.map(({ tagId }) => tagId).includes(tag)))
        : parsedProducts;
      
      const filteredByExpireAt = expireAt
        ? filteredByTags.filter((product) => product.batchProduct?.expireAt.toString().includes(expireAt.toString()))
        : filteredByTags;
        
      const { page, limit } = formattedSearchQuery;
      const pagedProducts = PaginationUtil.getPageContent({ page, limit, array: filteredByExpireAt })
        // eslint-disable-next-line sonarjs/no-identical-functions
        .map((product) => {
          const { imagesBrand: { logo, cover } } = product;
          
          const newImagesBrand = {
            logo: ImageFormatter.formatUrl({ imageName: logo, folderPath: '/establishments/logo' }),
            cover: ImageFormatter.formatUrl({ imageName: cover, folderPath: '/establishments/cover' }),
          };

          return {
            ...product,
            imagesBrand: {
              ...newImagesBrand,
            },
          } as IProductParsed;
        });

      return pagedProducts;
    } catch (error: CustomError | unknown) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);
      
      if (error instanceof CustomError) throw error;

      throw new CustomError(establishmentServiceUnavailable);
    }
  }

  public static async getProductByIdDashboard(productId: number) {
    try {
      const product = await EstablishmentsProductsModel.findByPk(
        productId,
        {
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
            // exclude: [
            //   'type',
            //   'soldOutAmount',
            //   'active',
            //   'purchasable',
            //   'createdAt',
            // ],
          },
          include: [
            {
              model: VouchersAvailableModel,
              attributes: [],
              as: 'vouchersAvailable',
              required: false,
              where: {
                orderId: null,
                expireAt: {
                  [Op.gt]: new Date(),
                },
              },
            },
            {
              model: BatchesModel,
              as: 'batchProduct',
              attributes: {
                exclude: [
                  'productId',
                  // 'createdAt',
                  // 'updatedAt',
                ],
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
            'batchProduct.batch_id',
          ],
        },
      );
  
      const isProductNotFound = !product;
      if (isProductNotFound) throw new CustomError(productNotFound);

      return product;
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);
      
      if (error instanceof CustomError) throw error;

      throw new CustomError(getProductError);
    }
  }

  public static async deleteProductTypeDashboard(typeId: number) {
    const t = await db.transaction();
    try {
      const protectedTypes = [1, 2];
      const isProtectedType = protectedTypes.includes(typeId);
      if (isProtectedType) throw new CustomError(protectedTypeError);
      
      const type = await ProductsTypesModel.findByPk(typeId, { transaction: t });

      const isTypeNotFound = !type;
      if (isTypeNotFound) throw new CustomError(typeNotFound);

      await type.destroy();

      await t.commit();
    } catch (error) {
      await t.rollback();
      console.log(CONSOLE_LOG_ERROR_TITLE, error);
      
      if (error instanceof CustomError) throw error;

      throw new CustomError(cannotDeleteTypeError);
    }
  }

  public static async createProductType({ name, fileName }: { name: string, fileName: string }) {
    const t = await db.transaction();
    try {
      const isNameInUse = await ProductsTypesModel.findOne({ where: { name }, transaction: t });
      if (isNameInUse) throw new CustomError(nameInUseError);

      await ProductsTypesModel.create(
        { name, appName: name, icon: fileName },
        { transaction: t },
      );

      await t.commit();
    } catch (error) {
      await t.rollback();
      console.log(CONSOLE_LOG_ERROR_TITLE, error);
      
      if (error instanceof CustomError) throw error;

      throw new CustomError(cannotCreateTypeError);
    }
  }
}