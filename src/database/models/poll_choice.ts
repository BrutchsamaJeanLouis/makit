import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import Project from "./project";
import Poll from "./poll";
import PollVote from "./poll_vote";

export default class PollChoice extends Model<InferAttributes<PollChoice>, InferCreationAttributes<PollChoice>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare option: string;
  declare pollId?: number;
  declare PollVotes: CreationOptional<PollVote[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
PollChoice.init(
  // @ts-ignore
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    option: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "poll_choices",
    timestamps: true,
    modelName: "PollChoice"
  }
);

Poll.hasMany(PollChoice, { foreignKey: "pollId" });
