import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsModel from './Establishments.model';
import EstablishmentsImagesModel from './EstablishmentsImages.model';

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
  declare createdAt: Date;
  declare updatedAt: Date;
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

EstablishmentsProductsModel.belongsTo(EstablishmentsImagesModel, {
  foreignKey: 'establishmentId',
  as: 'imagesBrand',
});
EstablishmentsImagesModel.hasMany(EstablishmentsProductsModel, {
  foreignKey: 'establishmentId',
  as: 'imagesBrand',
});

export default EstablishmentsProductsModel;
