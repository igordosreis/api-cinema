import { Request, Response } from 'express';
import {
  IProductQuerySchema,
  IProductRawQuery,
  IProductRawQuerySchema,
} from '../interfaces/IProducts';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';
import SearchService from '../services/Search.service';

export default class SearchController {
  public static async productsAndPacksSearch(req: Request, res: Response): Promise<void> {
    const searchQuery = <IProductRawQuery>req.query;
    IProductRawQuerySchema.parse(searchQuery);

    const formattedSearchQuery = formatRequestQueryUtil.formatProductQuery(searchQuery);
    IProductQuerySchema.parse(formattedSearchQuery);

    const productsAndPacks = await SearchService.productsAndPacksSearch(formattedSearchQuery);

    res.status(200).json(productsAndPacks);
  }
}
