import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';
import TagsModel from './Tags.model';

class TagsProductsModel extends Model {
  declare tagId: number;
  declare productId: number;
}

TagsProductsModel.init(
  {
    tagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'tags',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'establishments_products',
        key: 'product_id',
      },
    },
  },
  {
    underscored: true,
    sequelize: db,
    modelName: 'tags_products',
    timestamps: false,
  },
);

TagsProductsModel.belongsTo(TagsModel, { foreignKey: 'tagId', as: 'productTags' });
TagsModel.hasMany(TagsProductsModel, { foreignKey: 'tagId', as: 'productTags' });

TagsProductsModel.belongsTo(EstablishmentsProductsModel, {
  foreignKey: 'productId',
  as: 'tagsProducts',
});
EstablishmentsProductsModel.hasMany(TagsProductsModel, {
  foreignKey: 'productId',
  as: 'tagsProducts',
});

export default TagsProductsModel;
