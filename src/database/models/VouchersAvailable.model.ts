import { DataTypes, Model } from 'sequelize';
import db from '.';

class VouchersAvailableModel extends Model {
  declare id: number;
  declare voucherCode: string;
  declare productId: string;
  declare expireDate: Date;
  declare createdAt: Date;
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
      defaultValue: null,
    },
  },
  {
    modelName: 'vouchers_available',
    sequelize: db,
    underscored: true,
    timestamps: false,
  },
);

export default VouchersAvailableModel;
