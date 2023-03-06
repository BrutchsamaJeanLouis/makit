import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import User from "./user";
import Project from "./project";
import HashTag from "./hashtag";

// for typeScript typing
export default class ProjectHashTag extends Model<
  InferAttributes<ProjectHashTag>,
  InferCreationAttributes<ProjectHashTag>
> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare hashtagId: number;
  declare projectId: number;
  declare HashTag: CreationOptional<HashTag>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
// const User = sequelize.define('User', {
ProjectHashTag.init(
  //@ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  },
  {
    // Other model options go here
    sequelize,
    tableName: "project_hashtags",
    timestamps: true,
    modelName: "ProjectHashTag"
  }
);

ProjectHashTag.belongsTo(HashTag, { foreignKey: "hashtagId" });
HashTag.hasMany(ProjectHashTag, { foreignKey: "hashtagId" }); // reverse association
ProjectHashTag.belongsTo(Project, { foreignKey: "projectId" });
Project.hasMany(ProjectHashTag, { foreignKey: "projectId" }); // reverse association
