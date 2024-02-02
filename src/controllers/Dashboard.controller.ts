import { Request, Response } from 'express';
import ProductsController from './Products.controller';
import VouchersController from './Vouchers.controller';
import TagsController from './Tags.controller';

export default class DashboardController {
  public static async createProduct(req: Request, res: Response): Promise<void> {
    ProductsController.createProduct(req, res);
  }

  public static async createVoucher(req: Request, res: Response): Promise<void> {
    VouchersController.createVoucher(req, res);
  }

  public static async createTag(req: Request, res: Response): Promise<void> {
    TagsController.createTag(req, res);
  }
}
