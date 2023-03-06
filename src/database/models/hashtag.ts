import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";
import Project from "./project";

export default class HashTag extends Model<InferAttributes<HashTag>, InferCreationAttributes<HashTag>> {
  // Only Used for typescript to pick up intellisense and types
  // The Init function below are the actual DB columns
  declare id: CreationOptional<number>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// allowNull defaults to true if not set
HashTag.init(
  // @ts-ignore
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "hashtags",
    timestamps: true,
    modelName: "HashTag"
  }
);
// project has many hashTags
Project.hasMany(HashTag, { foreignKey: "projectId" });
