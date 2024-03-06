import { Request, Response } from 'express';
import { PacksService } from '../services';
import {
  IPackSearchQueryRaw,
  IPackSearchQueryRawSchema,
  IPackSearchQuerySchema,
} from '../interfaces/IPacks';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';

export default class PacksController {
  public static async getAllPacks(_req: Request, res: Response): Promise<void> {
    const allPacks = await PacksService.getAllPacks();

    res.status(200).json(allPacks);
  }

  public static async getPackDetails(req: Request, res: Response): Promise<void> {
    const { id: packId } = req.params;

    const allPacks = await PacksService.getPackDetails(Number(packId));

    res.status(200).json(allPacks);
  }

  public static async getPackByQuery(req: Request, res: Response): Promise<void> {
    const searchQuery = <IPackSearchQueryRaw>req.query;
    IPackSearchQueryRawSchema.parse(searchQuery);

    const formattedSearchQuery = formatRequestQueryUtil.formatPackQuery(searchQuery);
    IPackSearchQuerySchema.parse(formattedSearchQuery);

    const packs = await PacksService.getPacksByQuery(formattedSearchQuery);

    res.status(200).json(packs);
  }
}
