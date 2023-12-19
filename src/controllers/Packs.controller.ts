import { Request, Response } from 'express';
import { PacksService } from '../services';

export default class PacksController {
  public static async getAllPacks(_req: Request, res: Response): Promise<void> {
    const allPacks = await PacksService.getAllPacks();

    res.status(200).json(allPacks);
  }

  public static async getPackSummaryById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const allPacks = await PacksService.getPackSummaryById(Number(id));

    res.status(200).json(allPacks);
  }
}
