import { DataTypes, Model } from 'sequelize';
import db from '.';

class StatesModel extends Model {
  declare id: number;
  declare name: string;
  declare abbreviation: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

StatesModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    abbreviation: {
      type: DataTypes.STRING,
      defaultValue: null,
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
    modelName: 'states',
    sequelize: db,
    underscored: true,
    timestamps: false,
  },
);

export default StatesModel;
