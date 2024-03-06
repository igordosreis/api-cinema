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
    const searchQuery = <IProductRawQuery>req.query;
    IProductRawQuerySchema.parse(searchQuery);

    const formattedSearchQuery = formatRequestQueryUtil.formatProductQuery(searchQuery);
    IProductQuerySchema.parse(formattedSearchQuery);
    const products = await ProductsService.getProductsByQuery(formattedSearchQuery);

    res.status(200).json(products);
  }

  public static async getProductsTypes(_req: Request, res: Response): Promise<void> {
    const allProductsTypes = await ProductsService.getProductsTypes();

    res.status(200).json(allProductsTypes);
  }

  public static async getProductDetails(req: Request, res: Response): Promise<void> {
    const { id: productId } = req.params;

    const productDetails = await ProductsService.getProductDetails(Number(productId));

    res.status(200).json(productDetails);
  }
}
