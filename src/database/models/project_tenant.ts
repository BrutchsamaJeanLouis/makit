import { Sequelize, DataTypes, Model } from "sequelize";
import sequelize from "../sequelize-connection";
import User from "./user";
import Project from "./project";

export default class ProjectTenant extends Model {}

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

// ProjectTenant.sync({ alter: true })
//   .then(() => console.log("successfully synced projectTenant model"))
//   .catch((err: any) => console.log(err));

// module.exports = User
