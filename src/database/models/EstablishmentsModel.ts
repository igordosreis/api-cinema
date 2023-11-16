import { DataTypes, Model } from 'sequelize';
import db from '.';

class EstablishmentsModel extends Model {
  declare id: number;
  declare name: string;
  declare about: string;
  declare primaryColor: string;
  declare link: string;
  declare linkDescription: string;
  declare telephone: string;
  declare telephonTwo: string;
  declare whatsapp: string;
  declare instagram: string;
  declare site: string;
  declare rules: string;
  declare keyWord: string;
  declare active: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare views: number;
  declare underHighlight: boolean;
}

EstablishmentsModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    about: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    primaryColor: {
      type: DataTypes.STRING,
      defaultValue: '000000',
      allowNull: false,
    },
    link: {
      type: DataTypes.TEXT('long'),
    },
    linkDescription: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    telephone: {
      type: DataTypes.STRING(150),
      defaultValue: null,
    },
    telephoneTwo: {
      type: DataTypes.STRING(150),
      defaultValue: null,
    },
    whatsapp: {
      type: DataTypes.STRING(150),
      defaultValue: null,
    },
    instagram: {
      type: DataTypes.STRING(150),
      defaultValue: null,
    },
    site: {
      type: DataTypes.STRING(150),
      defaultValue: null,
    },
    rules: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    keyWords: {
      type: DataTypes.TEXT,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      // defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      // defaultValue: DataTypes.NOW,
    },
    views: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    underHighlight: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    modelName: 'establishments',
    sequelize: db,
    underscored: true,
    timestamps: false,
  },
);

export default EstablishmentsModel;
