import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';
import EstablishmentsModel from './Establishments.model';
import BatchesModel from './Batches.model';

class VouchersWithdrawModel extends Model {
  declare id: number;
  declare voucherCode: string;
  declare productId: number;
  declare establishmentId: number;
  declare batchId: number;
  declare soldPrice: number;
  declare expireAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare motive: string;
}

VouchersWithdrawModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    batchId: {
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
    modelName: 'vouchers_withdraw',
    sequelize: db,
    underscored: true,
    timestamps: false,
    freezeTableName: true,
  },
);

VouchersWithdrawModel.belongsTo(EstablishmentsProductsModel, {
  foreignKey: 'productId',
  as: 'vouchersWithdraw',
});
EstablishmentsProductsModel.hasMany(VouchersWithdrawModel, {
  foreignKey: 'productId',
  as: 'vouchersWithdraw',
});

VouchersWithdrawModel.belongsTo(EstablishmentsModel, {
  foreignKey: 'establishmentId',
  as: 'brand',
});
EstablishmentsModel.hasMany(VouchersWithdrawModel, {
  foreignKey: 'establishmentId',
  as: 'vouchersWithdrawInfo',
});

VouchersWithdrawModel.belongsTo(BatchesModel, {
  foreignKey: 'batchId',
  as: 'vouchersWithdrawBatchInfo',
});
BatchesModel.hasMany(VouchersWithdrawModel, {
  foreignKey: 'batchId',
  as: 'vouchersWithdrawBatchInfo',
});

export default VouchersWithdrawModel;
