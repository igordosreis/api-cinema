import { DataTypes, Model } from 'sequelize';
import db from '.';
import EstablishmentsProductsModel from './EstablishmentsProducts.model';
// import EstablishmentsModel from './Establishments.model';

class BatchesModel extends Model {
  declare id: number;
  declare batchCode: string;
  declare productId: number;
  declare establishmentId: number;
  declare expireAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

BatchesModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    batchCode: {
      type: DataTypes.STRING,
    },
    productId: {
      type: DataTypes.INTEGER,
    },
    establishmentId: {
      type: DataTypes.INTEGER,
    },
    expireAt: {
      type: DataTypes.DATE,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    modelName: 'batches',
    sequelize: db,
    underscored: true,
    timestamps: false,
    freezeTableName: true,
  },
);

BatchesModel.belongsTo(EstablishmentsProductsModel, {
  foreignKey: 'productId',
  as: 'batchProduct',
});
EstablishmentsProductsModel.hasMany(BatchesModel, {
  foreignKey: 'productId',
  as: 'batchProduct',
});

// Batches.belongsTo(EstablishmentsModel, {
//   foreignKey: 'establishmentId',
//   as: 'batchInfo',
// });
// EstablishmentsModel.hasMany(Batches, {
//   foreignKey: 'establishmentId',
//   as: 'batchInfo',
// });

export default BatchesModel;
