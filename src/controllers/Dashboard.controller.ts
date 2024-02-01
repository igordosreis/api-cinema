import { Request, Response } from 'express';
import ProductsController from './Products.controller';

export default class DashboardController {
  public static async createProduct(req: Request, res: Response): Promise<void> {
    ProductsController.createProduct(req, res);
  }
}
