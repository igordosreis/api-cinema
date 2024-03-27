import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsAddressesModel from './EstablishmentsAddresses.model';

class Highlights extends Model {
  declare position: number;
  declare addressId: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Highlights.init(
  {
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    addressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'establishments_addresses',
        key: 'id',
      },
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
