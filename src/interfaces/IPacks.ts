import PacksModel from '../database/models/Packs.model';
import PacksProductsModel from '../database/models/PacksProducts.model';

export type IPackSummary = PacksModel & {
  packInfo: PacksProductsModel[];
};
