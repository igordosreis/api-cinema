import { DataTypes, Model } from 'sequelize';
import db from '.';
import VouchersUsedModel from './VouchersUsed.model';

class VouchersLogsModel extends Model {
  declare id: number;
  declare request: string;
  declare response: string;
  declare voucherId: string;
  declare date: Date;
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
    date: {
      type: DataTypes.DATE,
      defaultValue: null,
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

VouchersLogsModel.belongsTo(VouchersUsedModel, { foreignKey: 'voucherId', as: 'vouchersLogs' });
VouchersUsedModel.hasOne(VouchersLogsModel, { foreignKey: 'voucherId', as: 'vouchersLogs' });

export default VouchersLogsModel;
