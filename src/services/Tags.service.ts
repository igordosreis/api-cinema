/* eslint-disable max-lines-per-function */
import sequelize from 'sequelize';
import TagsModel from '../database/models/Tags.model';
import TagsTypesModel from '../database/models/TagsTypes.model';
import { ITagsNewFormatted } from '../interfaces/ITags';
import CustomError, { createTagError, getTagsError } from '../utils/customError.util';
import db from '../database/models';
import { CONSOLE_LOG_ERROR_TITLE } from '../constants';

export default class TagsService {
  public static async getAllTags() {
    try {
      const allTags = await TagsModel.findAll();

      return allTags;
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

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
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(getTagsError);
    }
  }

  public static async createTagsDashboard(tagsArray: ITagsNewFormatted, typeId: number) {
    const t = await db.transaction();
    try {
      const newTagsPromise = tagsArray.map(async ({ name }) => {
        const [tag, created] = await TagsModel.findOrCreate({
          where: {
            name: sequelize.where(
              sequelize.fn('LOWER', sequelize.col('name')),
              'LIKE',
              name.toLowerCase(),
            ),
          },
          defaults: {
            name,
          },
          transaction: t,
        });

        if (created) {
          await TagsTypesModel.create({ tagId: tag.id, typeId }, { transaction: t });
        }

        return tag;
      });

      await Promise.all(newTagsPromise);

      t.commit();
    } catch (error) {
      t.rollback();

      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(createTagError);
    }
  }
}
