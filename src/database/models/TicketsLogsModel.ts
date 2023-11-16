import { DataTypes, Model } from 'sequelize';
import db from '.';

class TicketsLogsModel extends Model {
  declare id: number;
  declare request: string;
  declare response: string;
  declare ticket: string;
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
    ticket: {
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

export default TicketsLogsModel;
