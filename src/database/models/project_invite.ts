import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import User from "./user";
import Project from "./project";

// for typeScript typing
export default class ProjectInvite extends Model<
  InferAttributes<ProjectInvite>,
  InferCreationAttributes<ProjectInvite>
> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
}

// allowNull defaults to true if not set
// const User = sequelize.define('User', {
ProjectInvite.init(
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
    tableName: "project_invites",
    timestamps: true,
    modelName: "ProjectInvite"
  }
);

ProjectInvite.belongsTo(User, { foreignKey: "userId" });
ProjectInvite.belongsTo(Project, { foreignKey: "projectId" });
