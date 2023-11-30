import { DataTypes, Model } from 'sequelize';
import db from '.';
import VouchersUserModel from './VouchersUser.model';

class VouchersLogsModel extends Model {
  declare id: number;
  declare request: string;
  declare response: string;
  declare voucherId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

VouchersLogsModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    request: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    response: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    voucherId: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: 'vouchers_logs',
    sequelize: db,
    underscored: true,
    timestamps: false,
    freezeTableName: true,
  },
);

VouchersLogsModel.belongsTo(VouchersUserModel, { foreignKey: 'voucherId', as: 'vouchersLogs' });
VouchersUserModel.hasOne(VouchersLogsModel, { foreignKey: 'voucherId', as: 'vouchersLogs' });

export default VouchersLogsModel;
