import { DataTypes, Model } from 'sequelize';
import db from '.';

class CommentActions extends Model {
  declare id: number;
  declare name: string;
  declare urlPath: string;
  declare httpMethod: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

CommentActions.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    urlPath: {
      type: DataTypes.STRING,
    },
    httpMethod: {
      type: DataTypes.STRING,
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
    modelName: 'comment_actions',
    sequelize: db,
    underscored: true,
    timestamps: false,
    freezeTableName: true,
  },
);

export default CommentActions;
