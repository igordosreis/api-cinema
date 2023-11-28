import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsModel from './Establishments.model';

class EstablishmentsProductsModel extends Model {
  declare id: number;
  declare establishmentId: number;
  declare active: boolean;
  declare name: string;
  declare description: string;
  declare image: string;
  declare price: number;
  declare rules: string;
  declare type: string;
}

EstablishmentsProductsModel.init(
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
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rules: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    modelName: 'establishments_products',
    sequelize: db,
    underscored: true,
    timestamps: false,
  },
);

EstablishmentsProductsModel.belongsTo(EstablishmentsModel, {
  foreignKey: 'establishmentId',
  as: 'products',
});
EstablishmentsModel.hasMany(EstablishmentsProductsModel, {
  foreignKey: 'establishmentId',
  as: 'products',
});

export default EstablishmentsProductsModel;
