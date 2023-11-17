import { DataTypes, Model } from 'sequelize';
import db from '.';

class StatesModel extends Model {
  declare id: number;
  declare name: string;
  declare abbreviation: string;
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
  },
  {
    modelName: 'states',
    sequelize: db,
    underscored: true,
    timestamps: false,
  },
);

export default StatesModel;
