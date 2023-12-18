import { DataTypes, Model } from 'sequelize';
import db from '.';
import OrdersModel from './Orders.model';
import PacksModel from './Packs.model';

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

OrdersPacksModel.belongsTo(OrdersModel, { foreignKey: 'orderId', as: 'packDetails' });
OrdersModel.hasMany(OrdersPacksModel, { foreignKey: 'orderId', as: 'packDetails' });

OrdersPacksModel.belongsTo(PacksModel, { foreignKey: 'packId', as: 'packInfo' });
PacksModel.hasMany(OrdersPacksModel, { foreignKey: 'packId', as: 'packInfo' });

export default OrdersPacksModel;
