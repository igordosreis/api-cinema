import { Request, Response } from 'express';
import { PacksService } from '../services';

export default class PacksController {
  public static async getAllPacks(_req: Request, res: Response): Promise<void> {
    const allPacks = await PacksService.getAllPacks();

    res.status(200).json(allPacks);
  }
}
