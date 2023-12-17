import { DataTypes, Model } from 'sequelize';
import db from '.';
import OrdersModel from './Orders.model';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';

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
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'establishments_products',
        key: 'id',
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
    modelName: 'orders_products',
    timestamps: false,
  },
);

PacksProductsModel.belongsTo(OrdersModel, { foreignKey: 'orderId', as: 'productsDetails' });
OrdersModel.hasMany(PacksProductsModel, { foreignKey: 'orderId', as: 'productsDetails' });

PacksProductsModel.belongsTo(EstablishmentsProductsModel, {
  foreignKey: 'productId',
  as: 'productInfo',
});
EstablishmentsProductsModel.hasMany(PacksProductsModel, {
  foreignKey: 'productId',
  as: 'productInfo',
});

export default PacksProductsModel;
