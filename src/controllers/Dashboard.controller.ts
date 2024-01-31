import { Request, Response } from 'express';

export default class DashboardController {
  public static async createProduct(req: Request, res: Response): Promise<void> {
    res.status(200).end();
  }
}
