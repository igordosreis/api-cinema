import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';
import OrdersModel from './Orders.model';

class VouchersAvailableModel extends Model {
  declare id: number;
  declare voucherCode: string;
  declare productId: number;
  declare orderId: number;
  declare soldPrice: number;
  declare expireAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

VouchersAvailableModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    voucherCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    soldPrice: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false,
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
    modelName: 'vouchers_available',
    sequelize: db,
    underscored: true,
    timestamps: false,
    freezeTableName: true,
  },
);

VouchersAvailableModel.belongsTo(EstablishmentsProductsModel, {
  foreignKey: 'productId',
  as: 'vouchersAvailable',
});
EstablishmentsProductsModel.hasMany(VouchersAvailableModel, {
  foreignKey: 'productId',
  as: 'vouchersAvailable',
});

VouchersAvailableModel.belongsTo(OrdersModel, {
  foreignKey: 'orderId',
  as: 'vouchersOrderUnpaid',
});
OrdersModel.hasMany(VouchersAvailableModel, {
  foreignKey: 'orderId',
  as: 'vouchersOrderUnpaid',
});

export default VouchersAvailableModel;
