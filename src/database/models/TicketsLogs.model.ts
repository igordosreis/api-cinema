import { DataTypes, Model } from 'sequelize';
import db from '.';
import TicketsUsedModel from './TicketsUsed.model';

class TicketsLogsModel extends Model {
  declare id: number;
  declare request: string;
  declare response: string;
  declare ticketId: string;
  declare date: Date;
}

TicketsLogsModel.init(
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
    ticketId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    modelName: 'tickets_logs',
    sequelize: db,
    underscored: true,
    timestamps: false,
  },
);

TicketsLogsModel.belongsTo(TicketsUsedModel, { foreignKey: 'ticketsId', as: 'tickets_used' });
TicketsUsedModel.hasOne(TicketsLogsModel, { foreignKey: 'ticketsId', as: 'tickets_used' });

export default TicketsLogsModel;
