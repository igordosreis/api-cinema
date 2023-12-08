import { DataTypes, Model } from 'sequelize';
import db from '.';

class PlansModel extends Model {
  declare id: number;
  declare name: string;
  declare limitPerType: number;
  declare price: number;
  declare description: string;
  declare rules: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

PlansModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    limitPerType: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.STRING,
    },
    rules: {
      type: DataTypes.STRING,
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
    modelName: 'plans',
    sequelize: db,
    underscored: true,
    timestamps: false,
    freezeTableName: true,
  },
);

export default PlansModel;
