import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';
import PacksModel from './Packs.model';

class CartModel extends Model {
  declare userId: number;
  declare productId: number;
  declare packId: number;
  declare quantity: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

CartModel.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      references: {
        model: 'establishments_products',
        key: 'id',
      },
    },
    packId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      references: {
        model: 'packs',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: 'cart',
    sequelize: db,
    underscored: true,
    timestamps: false,
    freezeTableName: true,
  },
);

export default CartModel;

CartModel.hasMany(EstablishmentsProductsModel, {
  foreignKey: 'productId',
  as: 'productCart',
});

EstablishmentsProductsModel.belongsTo(CartModel, {
  foreignKey: 'productId',
  as: 'productCart',
});

CartModel.hasMany(PacksModel, {
  foreignKey: 'productId',
  as: 'packCart',
});

PacksModel.belongsTo(CartModel, {
  foreignKey: 'productId',
  as: 'packCart',
});
