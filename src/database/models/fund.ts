import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import Project from "./project";
import User from "./user";
import sequelize from "../sequelize-connection";

export default class Fund extends Model<InferAttributes<Fund>, InferCreationAttributes<Fund>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare amount: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
Fund.init(
  // @ts-ignore
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "funds",
    timestamps: true,
    modelName: "Fund"
  }
);
Fund.belongsTo(User, { foreignKey: "userId" });
Project.hasMany(Fund, { foreignKey: "projectId" });
