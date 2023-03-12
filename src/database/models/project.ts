import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import User from "./user";
import sequelize from "../sequelize-connection";
import ProjectTenant from "./project_tenant";
import { ProjectPhase, ProjectVisibility } from "../../utils/enums";
import ProjectHashTag from "./project_hashtag";
import Poll from "./poll";

// for typeScript typing
export default class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare userId?: number;
  declare visibility: ProjectVisibility;
  declare phase: ProjectPhase;
  declare User: CreationOptional<User>;
  declare ProjectTenants: CreationOptional<ProjectTenant>;
  declare ProjectHashTags: CreationOptional<ProjectHashTag[]>;
  declare Polls: CreationOptional<Poll[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
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
    },
    visibility: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phase: {
      type: DataTypes.STRING,
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
Project.belongsTo(User, { foreignKey: "userId", foreignKeyConstraint: true });
