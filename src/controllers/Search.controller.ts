/* eslint-disable max-lines-per-function */
import { Request, Response } from 'express';
import {
  IProductQuerySchema,
  IProductRawQuery,
  IProductRawQuerySchema,
} from '../interfaces/IProducts';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';
// import SearchService from '../services/Search.service';
import { PacksService, ProductsService } from '../services';

export default class SearchController {
  public static async productsAndPacksSearch(req: Request, res: Response) {
    const searchQuery = <IProductRawQuery>req.query;
    IProductRawQuerySchema.parse(searchQuery);

    const { type } = searchQuery;
    if (type === 'pack') {
      const formattedSearchQuery = formatRequestQueryUtil.formatProductQuery(searchQuery);
      IProductQuerySchema.parse(formattedSearchQuery);
  
      const { type: removedType, ...restOfQuery } = formattedSearchQuery;
      const packs = await PacksService.getPacksByQuery(restOfQuery);

      return res.status(200).json(packs);
    }
    
    const formattedSearchQuery = formatRequestQueryUtil.formatProductQuery(searchQuery);
    IProductQuerySchema.parse(formattedSearchQuery);

    const product = await ProductsService.getProductsByQuery(formattedSearchQuery);

    return res.status(200).json(product);
    // const formattedSearchQuery = formatRequestQueryUtil.formatProductQuery(searchQuery);
    // IProductQuerySchema.parse(formattedSearchQuery);

    // const productsAndPacks = await SearchService.productsAndPacksSearch(formattedSearchQuery);

    // res.status(200).json(productsAndPacks);
  }
}
