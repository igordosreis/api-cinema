import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';
import OrdersModel from './Orders.model';

class VouchersUserModel extends Model {
  declare id: number;
  declare voucherCode: string;
  declare productId: number;
  declare orderId: number;
  declare active: boolean;
  declare expireAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare soldAt: Date;
  declare soldPrice: number;
}

VouchersUserModel.init(
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
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    expireAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    soldAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    soldPrice: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: null,
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
    modelName: 'vouchers_user',
    sequelize: db,
    underscored: true,
    timestamps: false,
    freezeTableName: true,
  },
);

VouchersUserModel.belongsTo(EstablishmentsProductsModel, {
  foreignKey: 'productId',
  as: 'vouchersUser',
});
EstablishmentsProductsModel.hasMany(VouchersUserModel, {
  foreignKey: 'productId',
  as: 'vouchersUser',
});

VouchersUserModel.belongsTo(OrdersModel, {
  foreignKey: 'orderId',
  as: 'vouchersOrderPaid',
});
OrdersModel.hasMany(VouchersUserModel, {
  foreignKey: 'orderId',
  as: 'vouchersOrderPaid',
});

export default VouchersUserModel;
