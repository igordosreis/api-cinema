import { Request, Response } from 'express';
import { TagsService } from '../services';

export default class TagsController {
  public static async getAllTags(_req: Request, res: Response): Promise<void> {
    const allTags = await TagsService.getAllTags();

    res.status(200).json(allTags);
  }

  public static async getTagsByType(req: Request, res: Response): Promise<void> {
    const { id: typeId } = req.params;

    const tagsByType = await TagsService.getTagsByType(Number(typeId));

    res.status(200).json(tagsByType);
  }
}
