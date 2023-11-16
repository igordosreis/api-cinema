import { DataTypes, Model } from 'sequelize';
import db from '.';

class TicketsAvailableModel extends Model {
  declare id: number;
  declare voucher: string;
  declare establishmentId: string;
  declare expireDate: Date;
  declare createdAt: Date;
}

TicketsAvailableModel.init(
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
    modelName: 'tickets_available',
    sequelize: db,
    underscored: true,
    timestamps: false,
  },
);

export default TicketsAvailableModel;
