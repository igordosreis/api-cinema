import TagsModel from '../database/models/Tags.model';
import TagsTypesModel from '../database/models/TagsTypes.model';
import { ITagsNewFormatted } from '../interfaces/ITags';
import CustomError, { createTagError, getTagsError } from '../utils/customError.util';

export default class TagsService {
  public static async getAllTags() {
    try {
      const allTags = await TagsModel.findAll();

      return allTags;
    } catch (error) {
      throw new CustomError(getTagsError);
    }
  }

  public static async getTagsByType(typeId: number) {
    try {
      const tagsByType = await TagsTypesModel.findAll({
        include: [
          {
            model: TagsModel,
            as: 'tagsTypes',
          },
        ],
        where: { typeId },
      });
  
      return tagsByType;
    } catch (error) {
      throw new CustomError(getTagsError);
    }
  }

  public static async createTags(tagsArray: ITagsNewFormatted) {
    try {
      await TagsModel.bulkCreate(tagsArray);
    } catch (error) {
      throw new CustomError(createTagError);
    }
  }
}
