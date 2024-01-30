import TagsModel from '../database/models/Tags.model';
import TagsTypesModel from '../database/models/TagsTypes.model';
import { ITagsNew } from '../interfaces/ITags';

export default class TagsService {
  public static async getAllTags() {
    const allTags = await TagsModel.findAll();

    return allTags;
  }

  public static async getTagsByType(typeId: number) {
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
  }

  public static async createTags(tagsArray: ITagsNew) {
    console.log(tagsArray);
  }
}
