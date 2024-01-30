import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsModel from './Establishments.model';

class EstablishmentsImagesModel extends Model {
  declare establishmentId: number;
  declare logo: string;
  declare imageCarousel: string;
  declare cover: string;
  declare resizeColor: string;
  declare createdAt: Date;
  declare updatedAt: Date;
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
    logo: {
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
EstablishmentsModel.hasOne(EstablishmentsImagesModel, {
  foreignKey: 'establishmentId',
  as: 'images',
});

export default EstablishmentsImagesModel;
