import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import Project from "./project";
import User from "./user";
import sequelize from "../sequelize-connection";

// for typeScript typing
export default class ProjectLikeDislike extends Model<
  InferAttributes<ProjectLikeDislike>,
  InferCreationAttributes<ProjectLikeDislike>
> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare ratingType: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
ProjectLikeDislike.init(
  // @ts-ignore
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ratingType: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "project_likes_dislikes",
    timestamps: true,
    modelName: "ProjectLikeDislike"
  }
);

Project.hasMany(ProjectLikeDislike, { foreignKey: "projectID" });

ProjectLikeDislike.belongsTo(User, { foreignKey: "userId" });
