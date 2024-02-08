import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';
import OrdersModel from './Orders.model';
import EstablishmentsModel from './Establishments.model';

class VouchersAvailableModel extends Model {
  declare id: number;
  declare voucherCode: string;
  declare productId: number;
  declare establishmentId: number;
  declare soldPrice: number;
  declare expireAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare motive: string;
}

VouchersAvailableModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    voucherCode: {
      type: DataTypes.STRING,
    },
    productId: {
      type: DataTypes.INTEGER,
    },
    establishmentId: {
      type: DataTypes.INTEGER,
    },
    soldPrice: {
      type: DataTypes.INTEGER,
    },
    motive: {
      type: DataTypes.STRING,
    },
    expireAt: {
      type: DataTypes.DATE,
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

VouchersAvailableModel.belongsTo(EstablishmentsModel, {
  foreignKey: 'establishmentId',
  as: 'brand',
});
EstablishmentsModel.hasMany(VouchersAvailableModel, {
  foreignKey: 'establishmentId',
  as: 'vouchersAvailableInfo',
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
