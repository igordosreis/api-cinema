import { IProductQuery } from '../interfaces/IProducts';
import PacksService from './Packs.service';
import ProductsService from './Products.service';

export default class SearchService {
  public static async productsAndPacksSearch(formattedSearchQuery: IProductQuery) {
    const searchQueryWithNewLimit = {
      ...formattedSearchQuery,
      limit: Math.floor((formattedSearchQuery.limit / 2)),
    };

    const products = await ProductsService.getProductsByQuery(searchQueryWithNewLimit);
    const packs = await PacksService.getPacksByQuery(searchQueryWithNewLimit);
    
    const productsAndPacks = [...products, ...packs];

    return productsAndPacks;
  }
}
