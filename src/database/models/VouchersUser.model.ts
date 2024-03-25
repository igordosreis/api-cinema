import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';
import OrdersModel from './Orders.model';
import EstablishmentsModel from './Establishments.model';
import BatchesModel from './Batches.model';

class VouchersUserModel extends Model {
  declare id: number;
  declare voucherCode: string;
  declare productId: number;
  declare orderId: number;
  declare batchId: number;
  declare establishmentId: number;
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
    batchId: {
      type: DataTypes.STRING,
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
  as: 'productVoucherInfo',
});
EstablishmentsProductsModel.hasMany(VouchersUserModel, {
  foreignKey: 'productId',
  as: 'voucherUserProduct',
});

VouchersUserModel.belongsTo(EstablishmentsModel, {
  foreignKey: 'establishmentId',
  as: 'brand',
});
EstablishmentsModel.hasMany(VouchersUserModel, {
  foreignKey: 'establishmentId',
  as: 'vouchersUserInfo',
});

VouchersUserModel.belongsTo(BatchesModel, {
  foreignKey: 'batchId',
  as: 'vouchersUserBatchInfo',
});
BatchesModel.hasMany(VouchersUserModel, {
  foreignKey: 'batchId',
  as: 'vouchersUserBatchInfo',
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
