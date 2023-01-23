import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import Project from "./project";
import User from "./user";
import sequelize from "../sequelize-connection";

export default class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
  declare id: CreationOptional<number>;
  declare value: string;
}

// allowNull defaults to true if not set
Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "comments",
    timestamps: true,
    modelName: "Comment"
  }
);
Comment.belongsTo(User, { foreignKey: "userId" });
Project.hasMany(Comment, { foreignKey: "projectId" });
