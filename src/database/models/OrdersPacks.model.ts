import { DataTypes, Model } from 'sequelize';
import db from '.';
import OrdersModel from './Orders.model';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';

class OrdersPacksModel extends Model {
  declare orderId: number;
  declare packId: number;
  declare quantity: number;
  declare soldPrice: number;
}

OrdersPacksModel.init(
  {
    orderId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    packId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'packs',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    soldPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    underscored: true,
    sequelize: db,
    modelName: 'orders_packs',
    timestamps: false,
  },
);

OrdersPacksModel.belongsTo(OrdersModel, { foreignKey: 'orderId', as: 'productsDetails' });
OrdersModel.hasMany(OrdersPacksModel, { foreignKey: 'orderId', as: 'productsDetails' });

OrdersPacksModel.belongsTo(EstablishmentsProductsModel, {
  foreignKey: 'productId',
  as: 'productInfo',
});
EstablishmentsProductsModel.hasMany(OrdersPacksModel, {
  foreignKey: 'productId',
  as: 'productInfo',
});

export default OrdersPacksModel;
