import { DataTypes, Model } from 'sequelize';
import db from '.';

class Cart extends Model {
  declare userId: number;
  declare productId: number;
  declare packId: number;
  declare quantity: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Cart.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'establishments_products',
        key: 'id',
      },
    },
    packId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

export default Cart;
