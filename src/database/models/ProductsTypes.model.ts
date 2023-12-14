import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';

class ProductsTypes extends Model {
  declare id: number;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ProductsTypes.init(
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
    modelName: 'products_types',
    sequelize: db,
    underscored: true,
    timestamps: false,
    freezeTableName: true,
  },
);

ProductsTypes.hasMany(EstablishmentsProductsModel, {
  foreignKey: 'productsTypesId',
  as: 'type',
});
EstablishmentsProductsModel.belongsTo(ProductsTypes, {
  foreignKey: 'productsTypesId',
  as: 'type',
});

export default ProductsTypes;
