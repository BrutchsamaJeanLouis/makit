import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import User from "./user";
import sequelize from "../sequelize-connection";

// for typeScript typing
export default class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
}

// allowNull defaults to true if not set
Project.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
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
