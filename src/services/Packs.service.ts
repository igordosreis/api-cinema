/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
import sequelize, { Op } from 'sequelize';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import PacksModel from '../database/models/Packs.model';
import PacksProductsModel from '../database/models/PacksProducts.model';
import { IPackCreateInfo, IPackSearchQuery, IPackSummary, IPacksByQuery } from '../interfaces/IPacks';
import CustomError, { packNotFound, packServiceUnavailable } from '../utils/customError.util';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import EstablishmentsImagesModel from '../database/models/EstablishmentsImages.model';
import ProductsTypesModel from '../database/models/ProductsTypes.model';
import createPackSearchSqlizeQueryUtil from '../utils/createPackSearchSqlizeQuery.util';
import PaginationUtil from '../utils/pagination.util';
import TagsProductsModel from '../database/models/TagsProducts.model';
import TagsPacksModel from '../database/models/TagsPacks.model';
import db from '../database/models';
import { CONSOLE_LOG_ERROR_TITLE } from '../constants';
import PackUtil from '../utils/pack.util';
import DashboardUtil from '../utils/dashboard.util';
import EstablishmentsModel from '../database/models/Establishments.model';
import TagsModel from '../database/models/Tags.model';
import ImageFormatter from '../utils/formatImages.util';

export default class PacksService {
  public static async getPacksByQuery(formattedSearchQuery: IPackSearchQuery) {
    try {
    // const filteredPacks = await db.query(
    //   `SELECT
    //   packs.id,
    //   packs.active,
    //   packs.name,
    //   packs.description,
    //   packs.image,
    //   packs.price,
    //   packs.rules,
    //   packs.counter,
    //   packs.counter_limit AS counterLimit,
    //   packs.limited AS limited,
    //   packs.created_at AS createdAt,
    //   packs.updated_at AS updatedAt,
    //   packs.expire_at AS expireAt,
    //   packInfo.pack_id AS packInfopackId,
    //   packInfo.product_id AS packInfoproductId,
    //   packInfo.quantity AS packInfoquantity,
    //   packInfo.price AS packInfoprice,
    //   packInfoproductDetails.id AS packInfoproductDetailsid,
    //   packInfoproductDetails.establishment_id AS packInfoproductDetailsestablishmentId,
    //   packInfoproductDetails.active AS packInfoproductDetailsactive,
    //   packInfoproductDetails.name AS packInfoproductDetailsname,
    //   packInfoproductDetails.description AS packInfoproductDetailsdescription,
    //    packInfoproductDetails.image AS packInfoproductDetailsimage,
    //    packInfoproductDetails.price AS packInfoproductDetailsprice,
    //    packInfoproductDetails.rules AS packInfoproductDetailsrules,
    //    packInfoproductDetails.type AS packInfoproductDetailstype,
    //    packInfoproductDetails.sold_out_amount AS packInfoproductDetailssoldOutAmount,
    //    packInfoproductDetails.created_at AS packInfoproductDetailscreatedAt,
    //    packInfoproductDetails.updated_at AS packInfoproductDetailsupdatedAt,
    //    packInfoproductDetails.expire_at AS packInfoproductDetailsexpireAt,
    //    COUNT(packInfoproductDetailsvouchersAvailable.id) AS packInfoproductDetailsvouchersQuantity,
    //    COUNT(packInfoproductDetailsvouchersAvailable.product_id) > packInfoproductDetails.sold_out_amount AS packInfoproductDetailsavailable,
    //    packInfoproductDetailsimagesBrand.establishment_id AS packInfoproductDetailsimagesBrandestablishmentId,
    //    packInfoproductDetailsimagesBrand.image AS packInfoproductDetailsimagesBrandimage,
    //    packInfoproductDetailsimagesBrand.image_carousel AS packInfoproductDetailsimagesBrandimageCarousel,
    //    packInfoproductDetailsimagesBrand.cover AS packInfoproductDetailsimagesBrandcover,
    //    packInfoproductDetailsimagesBrand.resize_color AS packInfoproductDetailsimagesBrandresizeColor,
    //    packInfoproductDetailsimagesBrand.created_at AS packInfoproductDetailsimagesBrandcreatedAt,
    //    packInfoproductDetailsimagesBrand.updated_at AS packInfoproductDetailsimagesBrandupdatedAt,
    //    packInfoproductDetailstypeInfo.id AS packInfoproductDetailstypeInfoid,
    //    packInfoproductDetailstypeInfo.name AS packInfoproductDetailstypeInfoname,
    //    packInfoproductDetailstypeInfo.created_at AS packInfoproductDetailstypeInfocreatedAt,
    //    packInfoproductDetailstypeInfo.updated_at AS packInfoproductDetailstypeInfoupdatedAt
    //     FROM packs AS packs
    //     LEFT OUTER JOIN (
    //       packs_products AS packInfo
    //       INNER JOIN establishments_products AS packInfoproductDetails ON packInfo.product_id = packInfoproductDetails.id
    //       INNER JOIN vouchers_available AS packInfoproductDetailsvouchersAvailable ON packInfoproductDetails.id = packInfoproductDetailsvouchersAvailable.product_id AND packInfoproductDetailsvouchersAvailable.order_id IS NULL AND packInfoproductDetailsvouchersAvailable.expire_at
    //       LEFT OUTER JOIN establishments_images AS packInfoproductDetailsimagesBrand ON packInfoproductDetails.establishment_id = packInfoproductDetailsimagesBrand.establishment_id
    //       LEFT OUTER JOIN products_types AS packInfoproductDetailstypeInfo ON packInfoproductDetails.type = packInfoproductDetailstypeInfo.id
    //   ) ON packs.id = packInfo.pack_id
    //   WHERE (packInfoproductDetails.type = 1)
    //   GROUP BY packs.id,
    //    packInfo.product_id,
    //    packInfoproductDetails.id`,
    // );

      // const filteredPacks = await db.query(
      //   `SELECT  *
      //   FROM packs as pa
      //   JOIN packs_products as pp on pp.pack_id = pa.id
      //   JOIN establishments_products as pr on pr.id = pp.product_id
      //   WHERE pa.id in (
      //     SELECT pa.id
      //     FROM packs as pa
      //     JOIN packs_products as pp on pp.pack_id = pa.id
      //     JOIN establishments_products as pr on pr.id = pp.product_id
      //     WHERE pr.type = 2
      //   )`,
      // );

      // const filteredPacks = await db.query(
      //   `SELECT
      //   packs.id,
      //   packs.active,
      //   packs.name,
      //   packs.description,
      //   packs.image,
      //   packs.price,
      //   packs.rules,
      //   packs.counter,
      //   packs.counter_limit AS counterLimit,
      //   packs.limited AS limited,
      //   packs.created_at AS createdAt,
      //   packs.updated_at AS updatedAt,
      //   packs.expire_at AS expireAt,
      //   packInfo.pack_id AS packInfopackId,
      //   packInfo.product_id AS packInfoproductId,
      //   packInfo.quantity AS packInfoquantity,
      //   packInfo.price AS packInfoprice,
      //   packInfoproductDetails.id AS packInfoproductDetailsid,
      //   packInfoproductDetails.establishment_id AS packInfoproductDetailsestablishmentId,
      //   packInfoproductDetails.active AS packInfoproductDetailsactive,
      //   packInfoproductDetails.name AS packInfoproductDetailsname,
      //   packInfoproductDetails.description AS packInfoproductDetailsdescription,
      //   packInfoproductDetails.image AS packInfoproductDetailsimage,
      //   packInfoproductDetails.price AS packInfoproductDetailsprice,
      //   packInfoproductDetails.rules AS packInfoproductDetailsrules,
      //   packInfoproductDetails.type AS packInfoproductDetailstype,
      //   packInfoproductDetails.sold_out_amount AS packInfoproductDetailssoldOutAmount,
      //   packInfoproductDetails.created_at AS packInfoproductDetailscreatedAt,
      //   packInfoproductDetails.updated_at AS packInfoproductDetailsupdatedAt,
      //   packInfoproductDetails.expire_at AS packInfoproductDetailsexpireAt,
      //   COUNT(packInfoproductDetailsvouchersAvailable.id) AS packInfoproductDetailsvouchersQuantity,
      //   COUNT(packInfoproductDetailsvouchersAvailable.product_id) > packInfoproductDetails.sold_out_amount AS packInfoproductDetailsavailable,
      //   packInfoproductDetailsimagesBrand.establishment_id AS packInfoproductDetailsimagesBrandestablishmentId,
      //   packInfoproductDetailsimagesBrand.image AS packInfoproductDetailsimagesBrandimage,
      //   packInfoproductDetailsimagesBrand.image_carousel AS packInfoproductDetailsimagesBrandimageCarousel,
      //   packInfoproductDetailsimagesBrand.cover AS packInfoproductDetailsimagesBrandcover,
      //   packInfoproductDetailsimagesBrand.resize_color AS packInfoproductDetailsimagesBrandresizeColor,
      //   packInfoproductDetailsimagesBrand.created_at AS packInfoproductDetailsimagesBrandcreatedAt,
      //   packInfoproductDetailsimagesBrand.updated_at AS packInfoproductDetailsimagesBrandupdatedAt,
      //   packInfoproductDetailstypeInfo.id AS packInfoproductDetailstypeInfoid,
      //   packInfoproductDetailstypeInfo.name AS packInfoproductDetailstypeInfoname,
      //   packInfoproductDetailstypeInfo.created_at AS packInfoproductDetailstypeInfocreatedAt,
      //   packInfoproductDetailstypeInfo.updated_at AS packInfoproductDetailstypeInfoupdatedAt
      //   FROM packs AS packs
      //   LEFT OUTER JOIN (
      //       packs_products AS packInfo
      //       INNER JOIN establishments_products AS packInfoproductDetails ON packInfo.product_id = packInfoproductDetails.id
      //       INNER JOIN vouchers_available AS packInfoproductDetailsvouchersAvailable ON packInfoproductDetails.id = packInfoproductDetailsvouchersAvailable.product_id AND packInfoproductDetailsvouchersAvailable.order_id IS NULL AND packInfoproductDetailsvouchersAvailable.expire_at
      //       LEFT OUTER JOIN establishments_images AS packInfoproductDetailsimagesBrand ON packInfoproductDetails.establishment_id = packInfoproductDetailsimagesBrand.establishment_id
      //       LEFT OUTER JOIN products_types AS packInfoproductDetailstypeInfo ON packInfoproductDetails.type = packInfoproductDetailstypeInfo.id
      //   ) ON packs.id = packInfo.pack_id
      //   WHERE packs.id in (
      //       select packs.id
      //       FROM
      //        FROM packs AS packs
      //           LEFT OUTER JOIN (
      //       packs_products AS packInfo
      //       INNER JOIN establishments_products AS packInfoproductDetails ON packInfo.product_id = packInfoproductDetails.id
      //       INNER JOIN vouchers_available AS packInfoproductDetailsvouchersAvailable ON packInfoproductDetails.id = packInfoproductDetailsvouchersAvailable.product_id AND packInfoproductDetailsvouchersAvailable.order_id IS NULL AND packInfoproductDetailsvouchersAvailable.expire_at
      //       LEFT OUTER JOIN establishments_images AS packInfoproductDetailsimagesBrand ON packInfoproductDetails.establishment_id = packInfoproductDetailsimagesBrand.establishment_id
      //       LEFT OUTER JOIN products_types AS packInfoproductDetailstypeInfo ON packInfoproductDetails.type = packInfoproductDetailstypeInfo.id
      //   ) ON packs.id = packInfo.pack_id
      //   WHERE packInfoproductDetails.type = 1
      //   )
      //   GROUP BY packs.id,
      //    packInfo.product_id,
      //    packInfoproductDetails.id
      //   )`,
      // );

      // const filteredPacks = await PacksModel.findAll({
      //   include: [
      //     {
      //       model: PacksProductsModel,
      //       as: 'packInfo',
      //       include: [
      //         {
      //           model: EstablishmentsProductsModel,
      //           as: 'productDetails',
      //           attributes: {
      //             include: [
      //               [
      //                 sequelize.fn('COUNT', sequelize.col('vouchersAvailable.id')),
      //                 'vouchersQuantity',
      //               ],
      //               [
      //                 sequelize.literal(
      //                   'COUNT(vouchersAvailable.id) > establishments_products.sold_out_amount',
      //                 ),
      //                 'available',
      //               ],
      //             ],
      //             exclude: ['type'],
      //           },
      //           include: [
      //             {
      //               model: VouchersAvailableModel,
      //               attributes: [],
      //               as: 'vouchersAvailable',
      //               where: {
      //                 orderId: null,
      //                 expireAt: {
      //                   [Op.gt]: new Date(),
      //                 },
      //               },
      //             },
      //             {
      //               model: EstablishmentsImagesModel,
      //               as: 'imagesBrand',
      //             },
      //             {
      //               model: ProductsTypesModel,
      //               as: 'typeInfo',
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   ],
      // });

      const packs = await PacksModel.findAll({
        include: [
          {
            model: TagsPacksModel,
            as: 'tagsPack',
            attributes: {
              exclude: [
                'packId',
              ],
            },
            include: [
              {
                model: TagsModel,
                as: 'packTags',
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
          {
            model: EstablishmentsModel,
            as: 'brand',
            include: [
              {
                model: EstablishmentsImagesModel,
                as: 'images',
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
            ],
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
            model: PacksProductsModel,
            as: 'packInfo',
            include: [
              {
                model: EstablishmentsProductsModel,
                as: 'productDetails',
                required: true,
                attributes: {
                  include: [
                    [
                      sequelize.fn(
                        'COUNT',
                        sequelize.col('packInfo.productDetails.vouchersAvailable.id'),
                      ),
                      'vouchersQuantity',
                    ],
                  // [
                  //   sequelize.literal(
                  //     'COUNT(packInfo.productDetails.vouchersAvailable.product_id) > packInfo.productDetails.sold_out_amount',
                  //   ),
                  //   'available',
                  // ],
                  ],
                  exclude: [
                    'establishmentId',
                    'soldOutAmount',
                    'purchasable',
                    'createdAt',
                  ],
                },
                include: [
                  {
                    model: VouchersAvailableModel,
                    as: 'vouchersAvailable',
                    attributes: [],
                    where: {
                      orderId: null,
                      expireAt: {
                        [Op.gt]: new Date(),
                      },
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
              },
            ],
            attributes: {
              exclude: ['packId'],
            },
          },
          {
            model: EstablishmentsImagesModel,
            as: 'brandImages',
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
        ],
        attributes: {
          exclude: [
            'createdAt',
          ],
        },
        group: [
          'packs.pack_id',
          'packInfo.product_id',
          'packInfo.productDetails.product_id',
          'tagsPack.tag_id',
          'packInfo.productDetails.tagsProducts.tag_id',
        ],
        ...createPackSearchSqlizeQueryUtil.create(formattedSearchQuery),
      // limit: packSearchQuery.limit,
      // offset: packSearchQuery.limit * packSearchQuery.page,
      }) as IPacksByQuery[];

      const { available, type, term, tags } = formattedSearchQuery;

      const filteredPacks = packs
        .filter(({ packInfo }) => packInfo.every(({ productDetails: { active } }) => active))
        .map((pack) => {
          const { limited, counter, counterLimit, packInfo } = pack;
          const newPack: IPacksByQuery = pack.dataValues;

          if (limited) {
            const isAvailable = counter < counterLimit;
            newPack.available = isAvailable;

            return newPack;
          }

          const isAvailable = packInfo.every((product) => {
            const {
              quantity,
              productDetails: { vouchersQuantity, soldOutAmount },
            } = product;

            return quantity * vouchersQuantity > soldOutAmount;
          });
          newPack.available = isAvailable;

          return newPack;
        })
        .filter((pack) => !available || pack.available)
        .filter(
          ({ packInfo }) =>
            !type
          || packInfo.some(({ productDetails: { type: productType } }) => productType === type),
        )
        .filter(
          (pack) =>
            !term
          || pack.name.toLowerCase().includes(term)
          || pack.description.toLowerCase().includes(term)
          || pack.packInfo.some(
            ({ productDetails: { name, description } }) =>
              name.toLowerCase().includes(term) || description.toLowerCase().includes(term),
          ),
        )
        .filter(
          (pack) => 
            !tags
            || tags.every((tag) => pack.packTags.some(({ tagId }) => tagId === tag))
            || pack.packInfo.some(
              ({ productDetails: { productTags } }) =>
                tags.every((tag) => productTags.some(({ tagId }) => tagId === tag)),
            ),
        )
        .map((pack) => {
          const { brandImages: { logo, cover }, ...restOfInfo } = pack;
          const newImages = {
            logo: ImageFormatter.formatUrl({ imageName: logo, folderPath: '/establishments/logo' }),
            cover: ImageFormatter.formatUrl({ imageName: cover, folderPath: '/establishments/cover' }),
          };

          return {
            ...restOfInfo,
            imagesBrand: {
              ...newImages,
            },
          };
        });

      const { page, limit } = formattedSearchQuery;
      const pagedPacks = PaginationUtil.getPageContent({ page, limit, array: filteredPacks });

      return pagedPacks;
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);
      if (error instanceof CustomError) throw error;

      throw new CustomError(packServiceUnavailable);
    }
  }

  public static async getAllPacks() {
    const allPacks = await PacksModel.findAll({
      include: [
        {
          model: PacksProductsModel,
          as: 'packInfo',
          include: [
            {
              model: EstablishmentsProductsModel,
              as: 'productDetails',
            },
          ],
        },
      ],
    });

    return allPacks;
  }

  public static async getPackSummaryById(packId: number) {
    try {
      const pack = await PacksModel.findOne({
        include: [
          {
            model: PacksProductsModel,
            as: 'packInfo',
          },
        ],
        where: { packId },
      });
  
      const isPackNotFound = !pack;
      if (isPackNotFound) throw new CustomError(packNotFound);
  
      return pack as IPackSummary;
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);
      if (error instanceof CustomError) throw error;

      throw new CustomError(packServiceUnavailable);
    }
  }

  public static async createPack(newPackInfo: IPackCreateInfo) {
    const t = await db.transaction();
    try {
      const { counterLimit, tags, products, establishmentId, price, ...restOfInfo } = newPackInfo;
      
      const { packId } = await PacksModel.create(
        { ...restOfInfo, establishmentId, price, ...PackUtil.setupLimit(counterLimit) },
        { transaction: t },
      ); 

      await PackUtil.validateProducts({ products, packPrice: price, establishmentId, transaction: t });

      const formattedTagsArray = DashboardUtil.formatTagsArrayWithIds({ tags, packId });
      await TagsPacksModel.bulkCreate(formattedTagsArray, { transaction: t });

      const formattedProductsArray = PackUtil.formatProductArrayWithPackId(products, packId);
      await PacksProductsModel.bulkCreate(formattedProductsArray, { transaction: t });

      t.commit();

      return packId;
    } catch (error) {
      t.rollback();
      console.log(CONSOLE_LOG_ERROR_TITLE, error);
      if (error instanceof CustomError) throw error;

      throw new CustomError(packServiceUnavailable);
    }
  }
}
