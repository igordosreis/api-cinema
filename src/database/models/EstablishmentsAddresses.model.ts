import { DataTypes, Model } from 'sequelize';
import db from '.';
import CitiesModel from './Cities.model';
import EstablishmentsModel from './Establishments.model';

class EstablishmentsAddressesModel extends Model {
  declare id: number;
  declare establishmentId: number;
  declare name: string;
  declare active: boolean;
  declare address: string;
  declare cityId: number;
  declare latitude: string;
  declare longitude: string;
  declare telephone: string;
  declare code: string;
}

EstablishmentsAddressesModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cities',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    latitude: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    telephone: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    modelName: 'establishments_addresses',
    sequelize: db,
    underscored: true,
    timestamps: false,
  },
);

EstablishmentsAddressesModel.belongsTo(EstablishmentsModel, {
  foreignKey: 'establishmentId',
  as: 'establishment',
});
EstablishmentsModel.hasMany(EstablishmentsAddressesModel, { foreignKey: 'cityId', as: 'city' });

EstablishmentsAddressesModel.belongsTo(CitiesModel, { foreignKey: 'cityId', as: 'city' });
CitiesModel.hasMany(EstablishmentsAddressesModel, { foreignKey: 'cityId', as: 'city' });

export default EstablishmentsAddressesModel;
