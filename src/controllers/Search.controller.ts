import { Request, Response } from 'express';

export default class SearchController {
  public static async productsAndPacksSearch(req: Request, res: Response): Promise<void> {
    res.status(200).json();
  }
}
