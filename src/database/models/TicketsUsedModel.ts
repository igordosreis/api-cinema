import { DataTypes, Model } from 'sequelize';
import db from '.';

class TicketsUsedModel extends Model {
  declare id: number;
  declare voucher: string;
  declare establishmentId: number;
  declare userId: number;
  declare expireDate: Date;
  declare paymentId: string;
  declare createdAt: Date;
  declare soldAt: Date;
}

TicketsUsedModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    voucher: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    establishmentId: {
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
  },
  {
    modelName: 'tickets_used',
    sequelize: db,
    underscored: true,
    timestamps: false,
  },
);

export default TicketsUsedModel;
