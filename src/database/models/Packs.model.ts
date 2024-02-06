import { DataTypes, Model } from 'sequelize';
import db from '.';

class PacksModel extends Model {
  declare packId: number;
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
    packId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    rules: {
      type: DataTypes.STRING,
    },
    counter: {
      type: DataTypes.INTEGER,
    },
    counterLimit: {
      type: DataTypes.INTEGER,
    },
    limited: {
      type: DataTypes.BOOLEAN,
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
