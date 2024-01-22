import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsModel from './Establishments.model';
import TagsModel from './Tags.model';

class TagsEstablishmentsModel extends Model {
  declare tagId: number;
  declare establishmentId: number;
}

TagsEstablishmentsModel.init(
  {
    tagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'tags',
        key: 'id',
      },
    },
    establishmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'establishments',
        key: 'id',
      },
    },
  },
  {
    underscored: true,
    sequelize: db,
    modelName: 'tags_establishments',
    timestamps: false,
  },
);

TagsEstablishmentsModel.belongsTo(TagsModel, { foreignKey: 'tagId', as: 'tagsEstablishment' });
TagsModel.hasMany(TagsEstablishmentsModel, { foreignKey: 'tagId', as: 'tagsEstablishment' });

TagsEstablishmentsModel.belongsTo(EstablishmentsModel, {
  foreignKey: 'productId',
  as: 'establishmentTags',
});
EstablishmentsModel.hasMany(TagsEstablishmentsModel, {
  foreignKey: 'productId',
  as: 'establishmentTags',
});

export default TagsEstablishmentsModel;
