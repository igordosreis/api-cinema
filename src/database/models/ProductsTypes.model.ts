import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';

class ProductsTypesModel extends Model {
  declare id: number;
  declare name: string;
  declare appName: string;
  declare icon: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ProductsTypesModel.init(
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
    appName: {
      type: DataTypes.STRING,
    },
    icon: {
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
    modelName: 'products_types',
    sequelize: db,
    underscored: true,
    timestamps: false,
    freezeTableName: true,
  },
);

ProductsTypesModel.hasMany(EstablishmentsProductsModel, {
  foreignKey: 'type',
  as: 'typeInfo',
});
EstablishmentsProductsModel.belongsTo(ProductsTypesModel, {
  foreignKey: 'type',
  as: 'typeInfo',
});

export default ProductsTypesModel;
