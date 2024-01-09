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

  public static async getPackSummaryById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const allPacks = await PacksService.getPackSummaryById(Number(id));

    res.status(200).json(allPacks);
  }

  public static async getPackByQuery(req: Request, res: Response): Promise<void> {
    const packSearchQuery = <IPackSearchQueryRaw>req.query;
    IPackSearchQueryRawSchema.parse(packSearchQuery);

    const formattedPackSearchQuery = formatRequestQueryUtil.formatPackQuery(packSearchQuery);
    IPackSearchQuerySchema.parse(formattedPackSearchQuery);

    const filteredPacks = await PacksService.getPacksByQuery(formattedPackSearchQuery);

    res.status(200).json(filteredPacks);
  }
}
