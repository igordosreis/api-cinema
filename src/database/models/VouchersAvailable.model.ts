import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';

class VouchersAvailableModel extends Model {
  declare id: number;
  declare voucherCode: string;
  declare productId: string;
  declare expireDate: Date;
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
    expireDate: {
      type: DataTypes.DATE,
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

export default VouchersAvailableModel;
