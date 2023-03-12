import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import User from "./user";
import Project from "./project";
import HashTag from "./hashtag";
import Poll from "./poll";
import PollChoice from "./poll_choice";

// for typeScript typing
export default class PollVote extends Model<InferAttributes<PollVote>, InferCreationAttributes<PollVote>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare pollId: number;
  declare poll_choiceId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
// const User = sequelize.define('User', {
PollVote.init(
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
    tableName: "poll_votes",
    timestamps: true,
    modelName: "PollVote"
  }
);

PollVote.belongsTo(Poll, { foreignKey: "pollId" });
Poll.hasMany(PollVote, { foreignKey: "pollId" }); // reverse association
PollVote.belongsTo(PollChoice, { foreignKey: "poll_choiceId" });
PollChoice.hasMany(PollVote, { foreignKey: "poll_choiceId" }); // reverse association
