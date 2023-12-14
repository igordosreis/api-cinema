import { DataTypes, Model } from 'sequelize';
import db from '.';
import PlansModel from './Plans.model';
import ProductsTypesModel from './ProductsTypes.model';

class PlansProductsTypes extends Model {
  declare planId: number;
  declare productTypeId: number;
  declare quantity: number;
}

PlansProductsTypes.init(
  {
    planId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    productTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'product_type',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    underscored: true,
    sequelize: db,
    modelName: 'plans_products_types',
    timestamps: false,
  },
);

PlansProductsTypes.belongsTo(PlansModel, { foreignKey: 'planId', as: 'planDetails' });
PlansModel.hasMany(PlansProductsTypes, { foreignKey: 'planId', as: 'planDetails' });

PlansProductsTypes.belongsTo(ProductsTypesModel, {
  foreignKey: 'productTypeId',
  as: 'type',
});
ProductsTypesModel.hasMany(PlansProductsTypes, {
  foreignKey: 'productTypeId',
  as: 'type',
});

export default PlansProductsTypes;
