import { DataTypes, Model } from 'sequelize';
import db from '.';

class EstablishmentsModel extends Model {
  declare id: number;
  declare name: string;
  declare stateId: number;
  declare country: number;
  declare latitude: string;
  declare longitude: string;
}

EstablishmentsModel.init(
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
    stateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'states',
        key: 'id',
      },
    },
    country: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    latitude: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    longitude: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    modelName: 'cities',
    sequelize: db,
    underscored: true,
    timestamps: false,
  },
);

export default EstablishmentsModel;
