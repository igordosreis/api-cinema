import { Request, Response } from 'express';
import { TagsService } from '../services';
import { ITagsNewInBody, ITagsNewSchema } from '../interfaces/ITags';
import Dashboard from '../utils/dashboard.util';

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

  public static async createTags(req: Request, res: Response): Promise<void> {
    const { tags, typeId } = <ITagsNewInBody>req.body;
    ITagsNewSchema.parse(tags);

    const formattedTags = Dashboard.formatTagsArrayWithName(tags);
    await TagsService.createTags(formattedTags, typeId);

    res.status(200).end();
  }
}
