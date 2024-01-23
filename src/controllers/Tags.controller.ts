import { Request, Response } from 'express';
import { TagsService } from '../services';

export default class TagsController {
  public static async getAllTags(_req: Request, res: Response): Promise<void> {
    const allTags = await TagsService.getAllTags();

    res.status(200).json(allTags);
  }
}
