import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import User from "./user";
import sequelize from "../sequelize-connection";
import ProjectTenant from "./project_tenant";

// for typeScript typing
export default class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare userId?: number;
  declare User: CreationOptional<User>;
  declare ProjectTenants: CreationOptional<ProjectTenant>;
}

// allowNull defaults to true if not set
Project.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "projects",
    timestamps: true,
    modelName: "Project"
  }
);
Project.belongsTo(User, { foreignKey: "userId" });
