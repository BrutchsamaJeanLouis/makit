import { Sequelize, DataTypes, Model } from "sequelize";
import sequelize from "../sequelize-connection";
import User from "./user";
import Project from "./project";

export default class ProjectInvite extends Model {}

// allowNull defaults to true if not set
// const User = sequelize.define('User', {
ProjectInvite.init(
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

// ProjectInvite.sync({ alter: true })
//   .then(() => console.log("successfully synced projectInvite model"))
//   .catch((err: any) => console.log(err));

// module.exports = User
