import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';
import PacksModel from './Packs.model';

class CartModel extends Model {
  declare id: number;
  declare userId: number;
  declare productId: number;
  declare packId: number;
  declare establishmentId: number;
  declare quantity: number;
  declare waiting: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

CartModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // primaryKey: true,
      references: {
        model: 'establishments_products',
        key: 'product_id',
      },
    },
    packId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // primaryKey: true,
      references: {
        model: 'packs',
        key: 'pack_id',
      },
    },
    establishmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // primaryKey: true,
      // references: {
      //   model: 'packs',
      //   key: 'pack_id',
      // },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    waiting: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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

CartModel.belongsTo(EstablishmentsProductsModel, {
  foreignKey: 'productId',
  as: 'productCart',
});

EstablishmentsProductsModel.hasMany(CartModel, {
  foreignKey: 'productId',
  as: 'productCart',
});

CartModel.belongsTo(PacksModel, {
  foreignKey: 'packId',
  as: 'packCart',
});

PacksModel.hasMany(CartModel, {
  foreignKey: 'packId',
  as: 'packCart',
});
