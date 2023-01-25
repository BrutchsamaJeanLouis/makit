import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../sequelize-connection";

export default class HashTag extends Model<InferAttributes<HashTag>, InferCreationAttributes<HashTag>> {
  declare id: CreationOptional<number>;
  declare name: string;
}

// allowNull defaults to true if not set
HashTag.init(
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
