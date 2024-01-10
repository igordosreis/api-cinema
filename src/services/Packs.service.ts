/* eslint-disable max-lines-per-function */
import sequelize, { Op } from 'sequelize';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import PacksModel from '../database/models/Packs.model';
import PacksProductsModel from '../database/models/PacksProducts.model';
import { IPackSearchQuery, IPackSummary, IPacksByQuery } from '../interfaces/IPacks';
import CustomError, { packNotFound } from '../utils/customError.util';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import EstablishmentsImagesModel from '../database/models/EstablishmentsImages.model';
import ProductsTypesModel from '../database/models/ProductsTypes.model';
import createPackSearchSqlizeQueryUtil from '../utils/createPackSearchSqlizeQuery.util';
import Pagination from '../utils/pagination.util';

export default class PacksService {
  public static async getPacksByQuery(formattedSearchQuery: IPackSearchQuery) {
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
    //   packs.is_limited AS isLimited,
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
    //   packs.is_limited AS isLimited,
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
                  model: EstablishmentsImagesModel,
                  as: 'imagesBrand',
                },
                {
                  model: ProductsTypesModel,
                  as: 'typeInfo',
                },
              ],
            },
          ],
        },
      ],
      group: ['packs.id', 'packInfo.product_id', 'packInfo.productDetails.id'],
      ...createPackSearchSqlizeQueryUtil.create(formattedSearchQuery),
      // limit: packSearchQuery.limit,
      // offset: packSearchQuery.limit * packSearchQuery.page,
    }) as IPacksByQuery[];

    const { available, type, term } = formattedSearchQuery;

    const filteredPacks = packs
      .map((pack) => {
        const { isLimited, counter, counterLimit, packInfo } = pack;
        const newPack: IPacksByQuery = pack.dataValues;

        if (isLimited) {
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
      );

    const { page, limit } = formattedSearchQuery;
    const pagedPacks = Pagination.getPageContent({ page, limit, array: filteredPacks });

    return pagedPacks;
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
    const pack = await PacksModel.findOne({
      include: [
        {
          model: PacksProductsModel,
          as: 'packInfo',
        },
      ],
      where: { id: packId },
    });

    const isPackNotFound = !pack;
    if (isPackNotFound) throw new CustomError(packNotFound);

    return pack as IPackSummary;
  }
}
