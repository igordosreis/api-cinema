import { DataTypes, Model } from 'sequelize';
import db from '.';

class PacksModel extends Model {
  declare id: number;
  declare active: boolean;
  declare name: string;
  declare description: string;
  declare image: string;
  declare price: number;
  declare rules: string;
  declare counter: number;
  declare counterLimit: number;
  declare limited: boolean;
  declare soldOutAmount: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare expireAt: Date;
}

PacksModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rules: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    counter: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    counterLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    limited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      // defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      // defaultValue: DataTypes.NOW,
    },
    expireAt: {
      type: DataTypes.DATE,
      // defaultValue: DataTypes.NOW,
    },
  },
  {
    modelName: 'packs',
    sequelize: db,
    underscored: true,
    timestamps: false,
  },
);

export default PacksModel;
