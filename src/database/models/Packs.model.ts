import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsModel from './Establishments.model';
import EstablishmentsImagesModel from './EstablishmentsImages.model';

class PacksModel extends Model {
  declare packId: number;
  declare active: boolean;
  declare name: string;
  declare description: string;
  declare image: string;
  declare price: number;
  declare rules: string;
  declare establishmentId: number;
  declare counter: number;
  declare counterLimit: number;
  declare limited: boolean;
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
    establishmentId: {
      type: DataTypes.INTEGER,
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

PacksModel.belongsTo(EstablishmentsModel, {
  foreignKey: 'establishmentId',
  as: 'brand',
});
EstablishmentsModel.hasMany(PacksModel, {
  foreignKey: 'establishmentId',
  as: 'packs',
});

PacksModel.belongsTo(EstablishmentsImagesModel, {
  foreignKey: 'establishmentId',
  as: 'brandImages',
});
EstablishmentsImagesModel.hasMany(PacksModel, {
  foreignKey: 'establishmentId',
  as: 'brandImages',
});
