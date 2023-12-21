/* eslint-disable max-lines-per-function */
import sequelize, { Op } from 'sequelize';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import PacksModel from '../database/models/Packs.model';
import PacksProductsModel from '../database/models/PacksProducts.model';
import { IPackSummary } from '../interfaces/IPacks';
import CustomError, { packNotFound } from '../utils/customError.util';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import EstablishmentsImagesModel from '../database/models/EstablishmentsImages.model';
import ProductsTypesModel from '../database/models/ProductsTypes.model';

export default class PacksService {
  public static async getPacksByQuery() {
    const filteredPacks = await PacksModel.findAll({
      include: [
        {
          model: PacksProductsModel,
          as: 'packInfo',
          include: [
            {
              model: EstablishmentsProductsModel,
              as: 'productDetails',
              attributes: {
                include: [
                  [
                    sequelize.fn('COUNT', sequelize.col('vouchersAvailable.id')),
                    'vouchersQuantity',
                  ],
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
    });

    return filteredPacks;
  }

  public static async getAllPacks() {
    // const allPacks = await PacksModel.findAll({
    //   include: [
    //     {
    //       model: PacksProductsModel,
    //       as: 'packInfo',
    //       include: [
    //         {
    //           model: EstablishmentsProductsModel,
    //           as: 'productDetails',
    //         },
    //       ],
    //     },
    //   ],
    // });
    const allPacks = await PacksModel.findAll({
      include: [
        {
          model: PacksProductsModel,
          as: 'packInfo',
          include: [
            {
              model: EstablishmentsProductsModel,
              as: 'productDetails',
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
                  //     'COUNT(packInfo.productDetails.vouchersAvailable.id) > packInfo.productDetails.sold_out_amount',
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
      group: ['packs.id', 'packInfo.product_id', 'packInfo.productDetails.id'], // Adjust column names
      where: {
        [Op.and]: {
          [Op.or]: {
            name: { [Op.substring]: 'term' },
            description: { [Op.substring]: 'term' },
            '$packInfo.productDetails.name$': { [Op.substring]: 'term' },
            '$packInfo.productDetails.description$': { [Op.substring]: 'term' },
          },
          '$packInfo.productDetails.type': { [Op.eq]: 'type' },
          '$packInfo.productDetails.establishmentId': { [Op.eq]: 'establishmentId' },
        },
      },
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
