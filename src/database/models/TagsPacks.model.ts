import { DataTypes, Model } from 'sequelize';
import db from '.';
import TagsModel from './Tags.model';
import PacksModel from './Packs.model';

class TagsPacksModel extends Model {
  declare tagId: number;
  declare packId: number;
}

TagsPacksModel.init(
  {
    tagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'tags',
        key: 'id',
      },
    },
    packId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'packs',
        key: 'pack_id',
      },
    },
  },
  {
    underscored: true,
    sequelize: db,
    modelName: 'tags_packs',
    timestamps: false,
  },
);

TagsPacksModel.belongsTo(TagsModel, { foreignKey: 'tagId', as: 'tagsPack' });
TagsModel.hasMany(TagsPacksModel, { foreignKey: 'tagId', as: 'tagsPack' });

TagsPacksModel.belongsTo(PacksModel, { foreignKey: 'packId', as: 'packTags' });
PacksModel.hasMany(TagsPacksModel, { foreignKey: 'packId', as: 'packTags' });

export default TagsPacksModel;
