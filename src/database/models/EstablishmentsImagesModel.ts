import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsModel from './EstablishmentsModel';

class EstablishmentsImagesModel extends Model {
  declare id: number;
  declare image: string;
  declare imageCarousel: string;
  declare cover: string;
  declare resizeColor: string;
}

EstablishmentsImagesModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    imageCarousel: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    cover: {
      type: DataTypes.STRING(120),
      defaultValue: null,
    },
    resizeColor: {
      type: DataTypes.STRING,
      defaultValue: '#ffffff',
    },
  },
  {
    modelName: 'establishments_addresses',
    sequelize: db,
    underscored: true,
    timestamps: false,
  },
);

EstablishmentsImagesModel.belongsTo(EstablishmentsModel, {
  foreignKey: 'establishmentId',
  as: 'establishment',
});
EstablishmentsModel.hasMany(EstablishmentsImagesModel, {
  foreignKey: 'cityId',
  as: 'city',
});

export default EstablishmentsImagesModel;
