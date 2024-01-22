import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';

class TagsModel extends Model {
  declare id: number;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

TagsModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      // defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      // defaultValue: DataTypes.NOW,
    },
  },
  {
    modelName: 'tags',
    sequelize: db,
    underscored: true,
    timestamps: false,
    freezeTableName: true,
  },
);

TagsModel.hasMany(EstablishmentsProductsModel, {
  foreignKey: 'type',
  as: 'typeInfo',
});
EstablishmentsProductsModel.belongsTo(TagsModel, {
  foreignKey: 'type',
  as: 'typeInfo',
});

export default TagsModel;
