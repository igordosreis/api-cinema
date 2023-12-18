import { Request, Response } from 'express';
import { ProductsService } from '../services';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';
import { IProductRawQuery } from '../interfaces/IProducts';

export default class ProductsController {
  public static async getProductsByQuery(req: Request, res: Response): Promise<void> {
    const searchQuery = req as IProductRawQuery;

    const formattedQuery = formatRequestQueryUtil.formatProductQuery(searchQuery);
    const filteredProducts = await ProductsService.getProductsByQuery(formattedQuery);

    res.status(200).json(filteredProducts);
  }

  public static async getProductsTypes(_req: Request, res: Response): Promise<void> {
    const allProductsTypes = await ProductsService.getProductsTypes();

    res.status(200).json(allProductsTypes);
  }
}
