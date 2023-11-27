import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsModel from './Establishments.model';

class EstablishmentsImagesModel extends Model {
  declare establishmentId: number;
  declare image: string;
  declare imageCarousel: string;
  declare cover: string;
  declare resizeColor: string;
}

EstablishmentsImagesModel.init(
  {
    establishmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'establishments',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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
    modelName: 'establishments_images',
    sequelize: db,
    underscored: true,
    timestamps: false,
  },
);

EstablishmentsImagesModel.belongsTo(EstablishmentsModel, {
  foreignKey: 'establishmentId',
  as: 'images',
});
EstablishmentsModel.hasMany(EstablishmentsImagesModel, {
  foreignKey: 'establishmentId',
  as: 'images',
});

export default EstablishmentsImagesModel;
