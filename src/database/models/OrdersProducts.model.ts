import { DataTypes, Model } from 'sequelize';
import db from '.';
import OrdersModel from './Orders.model';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';

class OrdersProductsModel extends Model {
  declare orderId: number;
  declare productId: number;
  declare quantity: number;
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
        key: 'id',
      },
    },
    quantity: {
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

OrdersProductsModel.belongsTo(OrdersModel, { foreignKey: 'orderId', as: 'order' });
OrdersModel.hasMany(OrdersProductsModel, { foreignKey: 'orderId', as: 'order' });

OrdersProductsModel.belongsTo(EstablishmentsProductsModel, {
  foreignKey: 'productId',
  as: 'productsInOrder',
});
EstablishmentsProductsModel.hasMany(OrdersProductsModel, {
  foreignKey: 'productId',
  as: 'productsInOrder',
});

export default OrdersProductsModel;
