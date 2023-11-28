import { DataTypes, Model } from 'sequelize';
import db from '.';
import StatesModel from './States.model';

class CitiesModel extends Model {
  declare id: number;
  declare name: string;
  declare stateId: number;
  declare latitude: string;
  declare longitude: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

CitiesModel.init(
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
    latitude: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    longitude: {
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
    modelName: 'cities',
    sequelize: db,
    underscored: true,
    timestamps: false,
  },
);

CitiesModel.belongsTo(StatesModel, { foreignKey: 'stateId', as: 'state' });
StatesModel.hasMany(CitiesModel, { foreignKey: 'stateId', as: 'state' });

export default CitiesModel;
