import { Request, Response } from 'express';
import { ProductsService } from '../services';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';
import {
  IProductQuerySchema,
  IProductRawQuery,
  IProductRawQuerySchema,
} from '../interfaces/IProducts';

export default class ProductsController {
  public static async getProductsByQuery(req: Request, res: Response): Promise<void> {
    const searchQuery = <IProductRawQuery>req.params;
    IProductRawQuerySchema.parse(searchQuery);

    const formattedQuery = formatRequestQueryUtil.formatProductQuery(searchQuery);
    IProductQuerySchema.parse(formattedQuery);
    const filteredProducts = await ProductsService.getProductsByQuery(formattedQuery);

    res.status(200).json(filteredProducts);
  }

  public static async getProductsTypes(_req: Request, res: Response): Promise<void> {
    const allProductsTypes = await ProductsService.getProductsTypes();

    res.status(200).json(allProductsTypes);
  }
}
