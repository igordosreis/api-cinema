import { DataTypes, Model } from 'sequelize';
import db from '.';
import TagsModel from './Tags.model';
import ProductsTypesModel from './ProductsTypes.model';

class TagsTypesModel extends Model {
  declare tagId: number;
  declare typeId: number;
}

TagsTypesModel.init(
  {
    tagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'tags',
        key: 'id',
      },
    },
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'products_types',
        key: 'id',
      },
    },
  },
  {
    underscored: true,
    sequelize: db,
    modelName: 'tags_types',
    timestamps: false,
  },
);

TagsTypesModel.belongsTo(TagsModel, { foreignKey: 'tagId', as: 'tagsTypes' });
TagsModel.hasMany(TagsTypesModel, { foreignKey: 'tagId', as: 'tagsTypes' });

TagsTypesModel.belongsTo(ProductsTypesModel, {
  foreignKey: 'typeId',
  as: 'typesTags',
});
ProductsTypesModel.hasMany(TagsTypesModel, {
  foreignKey: 'typeId',
  as: 'typesTags',
});

export default TagsTypesModel;
