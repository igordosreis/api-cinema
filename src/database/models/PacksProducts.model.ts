import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';
import PacksModel from './Packs.model';

class PacksProductsModel extends Model {
  declare packId: number;
  declare productId: number;
  declare quantity: number;
  declare price: number;
}

PacksProductsModel.init(
  {
    packId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'packs',
        key: 'pack_id',
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    underscored: true,
    sequelize: db,
    modelName: 'packs_products',
    timestamps: false,
  },
);

PacksProductsModel.belongsTo(EstablishmentsProductsModel, {
  foreignKey: 'productId',
  as: 'productDetails',
});
EstablishmentsProductsModel.hasMany(PacksProductsModel, {
  foreignKey: 'productId',
  as: 'productDetails',
});

PacksProductsModel.belongsTo(PacksModel, {
  foreignKey: 'packId',
  as: 'packInfo',
});
PacksModel.hasMany(PacksProductsModel, {
  foreignKey: 'packId',
  as: 'packInfo',
});

export default PacksProductsModel;
