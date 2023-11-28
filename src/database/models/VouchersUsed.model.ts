import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';

class VouchersUsedModel extends Model {
  declare id: number;
  declare voucherCode: string;
  declare productId: number;
  declare userId: number;
  declare expireDate: Date;
  declare paymentId: string;
  declare createdAt: Date;
  declare soldAt: Date;
  declare soldPrice: number;
}

VouchersUsedModel.init(
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expireDate: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    paymentId: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    soldAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    soldPrice: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: null,
    },
  },
  {
    modelName: 'vouchers_used',
    sequelize: db,
    underscored: true,
    timestamps: false,
    freezeTableName: true,
  },
);

VouchersUsedModel.belongsTo(EstablishmentsProductsModel, {
  foreignKey: 'productId',
  as: 'vouchersUsed',
});
EstablishmentsProductsModel.hasMany(VouchersUsedModel, {
  foreignKey: 'productId',
  as: 'vouchersUsed',
});

export default VouchersUsedModel;
