import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsModel from './Establishments.model';

class OrdersModel extends Model {
  declare id: number;
  declare userId: number;
  declare status: string;
  declare paymentId: string;
  declare totalPrice: number;
  declare totalUnits: number;
  declare establishmentId: number;
  declare expireAt: Date;
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
    establishmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'establishments',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    expireAt: {
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

OrdersModel.belongsTo(EstablishmentsModel, {
  foreignKey: 'establishmentId',
  as: 'establishmentInfo',
});
EstablishmentsModel.hasMany(OrdersModel, {
  foreignKey: 'establishmentId',
  as: 'establishmentInfo',
});

export default OrdersModel;
