import { DataTypes, Model } from 'sequelize';
import db from '.';
import CommentActions from './CommentActions.model';

class CommentLogs extends Model {
  declare id: number;
  declare comment: string;
  declare originalUrl: string;
  declare userId: string;
  declare actionId: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

CommentLogs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    comment: {
      type: DataTypes.STRING,
    },
    originalUrl: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.STRING,
    },
    actionId: {
      type: DataTypes.NUMBER,
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
    modelName: 'comment_logs',
    sequelize: db,
    underscored: true,
    timestamps: false,
    freezeTableName: true,
  },
);

CommentLogs.belongsTo(CommentActions, {
  foreignKey: 'actionId',
  as: 'commentAction',
});
CommentActions.hasMany(CommentLogs, {
  foreignKey: 'actionId',
  as: 'commentAction',
});

export default CommentLogs;
