import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsAddressesModel from './EstablishmentsAddresses.model';

class Highlights extends Model {
  declare id: number;
  declare position: number;
  declare addressId: number;
  declare establishmentId: number;
  declare cityId: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Highlights.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    addressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'establishments_addresses',
        key: 'id',
      },
    },
    establishmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'establishments',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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
    modelName: 'highlights',
    sequelize: db,
    underscored: true,
    timestamps: false,
    freezeTableName: true,
  },
);

Highlights.belongsTo(EstablishmentsAddressesModel, {
  foreignKey: 'addressId',
  as: 'highlightAddress',
});
EstablishmentsAddressesModel.hasMany(Highlights, {
  foreignKey: 'addressId',
  as: 'highlightAddress',
});

export default Highlights;
