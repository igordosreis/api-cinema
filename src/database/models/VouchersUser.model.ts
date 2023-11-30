import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';

class VouchersUserModel extends Model {
  declare id: number;
  declare voucherCode: string;
  declare productId: number;
  declare userId: number;
  declare active: boolean;
  declare expireDate: Date;
  declare paymentId: string;
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
      // defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      // defaultValue: DataTypes.NOW,
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

export default VouchersUserModel;
