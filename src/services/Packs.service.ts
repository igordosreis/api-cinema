import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import PacksModel from '../database/models/Packs.model';
import PacksProductsModel from '../database/models/PacksProducts.model';
import { IPackSummary } from '../interfaces/IPacks';
import CustomError, { packNotFound } from '../utils/customError.util';

export default class PacksService {
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
