import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import PacksModel from '../database/models/Packs.model';
import PacksProductsModel from '../database/models/PacksProducts.model';

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
              as: 'productInPackInfo',
            },
          ],
        },
      ],
    });

    return allPacks;
  }
}
