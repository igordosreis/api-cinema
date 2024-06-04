import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsAddressesModel from './EstablishmentsAddresses.model';

class FavoriteEstablishmentAddresses extends Model {
  declare userId: string;
  declare establishmentAddressesId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

FavoriteEstablishmentAddresses.init(
  {
    userId: {
      type: DataTypes.STRING,
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
    modelName: 'favorite_establishment_addresses',
    sequelize: db,
    underscored: true,
    timestamps: false,
    freezeTableName: true,
  },
);

FavoriteEstablishmentAddresses.belongsTo(EstablishmentsAddressesModel, {
  foreignKey: 'addressId',
  as: 'favoriteEstablishmentAddress',
});
EstablishmentsAddressesModel.hasMany(FavoriteEstablishmentAddresses, {
  foreignKey: 'addressId',
  as: 'favoriteEstablishmentAddress',
});

export default FavoriteEstablishmentAddresses;
