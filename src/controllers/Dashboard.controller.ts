import { Request, Response } from 'express';
import ProductsController from './Products.controller';
import VouchersController from './Vouchers.controller';

export default class DashboardController {
  public static async createProduct(req: Request, res: Response): Promise<void> {
    ProductsController.createProduct(req, res);
  }

  public static async createVouchers(req: Request, res: Response): Promise<void> {
    VouchersController.createVouchers(req, res);
  }
}
