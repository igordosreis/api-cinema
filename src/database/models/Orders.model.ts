import { DataTypes, Model } from 'sequelize';
import db from '.';

class OrdersModel extends Model {
  declare id: number;
  declare userId: number;
  declare status: string;
  declare paymentId: string;
  declare totalPrice: number;
  declare totalUnits: number;
  declare expireDate: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

OrdersModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
    },
    paymentId: {
      type: DataTypes.STRING,
    },
    totalPrice: {
      type: DataTypes.INTEGER,
    },
    totalUnits: {
      type: DataTypes.INTEGER,
    },
    expireDate: {
      type: DataTypes.DATE,
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
    modelName: 'orders',
    sequelize: db,
    underscored: true,
    timestamps: false,
    freezeTableName: true,
  },
);

export default OrdersModel;
