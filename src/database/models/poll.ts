import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import Project from "./project";
import PollChoice from "./poll_choice";

export default class Poll extends Model<InferAttributes<Poll>, InferCreationAttributes<Poll>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare question: string;
  declare projectId?: number;
  declare PollChoices: CreationOptional<PollChoice[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
Poll.init(
  // @ts-ignore
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "polls",
    timestamps: true,
    modelName: "Poll"
  }
);
// project has many Polls
Project.hasMany(Poll, { foreignKey: "projectId" });
