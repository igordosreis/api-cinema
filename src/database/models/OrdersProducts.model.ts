import { DataTypes, Model } from 'sequelize';
import db from '.';
import OrdersModel from './Orders.model';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';

class OrdersProductsModel extends Model {
  declare orderId: number;
  declare productId: number;
  declare quantity: number;
  declare soldPrice: number;
}

OrdersProductsModel.init(
  {
    orderId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'orders',
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
    modelName: 'orders_products',
    timestamps: false,
  },
);

OrdersProductsModel.belongsTo(OrdersModel, { foreignKey: 'orderId', as: 'productsDetails' });
OrdersModel.hasMany(OrdersProductsModel, { foreignKey: 'orderId', as: 'productsDetails' });

OrdersProductsModel.belongsTo(EstablishmentsProductsModel, {
  foreignKey: 'productId',
  as: 'productInfo',
});
EstablishmentsProductsModel.hasMany(OrdersProductsModel, {
  foreignKey: 'productId',
  as: 'productInfo',
});

export default OrdersProductsModel;
