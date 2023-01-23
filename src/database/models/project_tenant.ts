import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import User from "./user";
import Project from "./project";

// for typeScript typing
export default class ProjectTenant extends Model<
  InferAttributes<ProjectTenant>,
  InferCreationAttributes<ProjectTenant>
> {
  declare id: CreationOptional<number>;
}

// allowNull defaults to true if not set
// const User = sequelize.define('User', {
ProjectTenant.init(
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
    tableName: "project_tenants",
    timestamps: true,
    modelName: "ProjectTenant"
  }
);

ProjectTenant.belongsTo(User, { foreignKey: "userId" });
ProjectTenant.belongsTo(Project, { foreignKey: "projectId" });
Project.hasMany(ProjectTenant, { foreignKey: "projectId" });
