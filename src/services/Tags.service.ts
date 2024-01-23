import TagsModel from '../database/models/Tags.model';

export default class TagsService {
  public static async getAllTags() {
    const allTags = TagsModel.findAll();

    return allTags;
  }
}
