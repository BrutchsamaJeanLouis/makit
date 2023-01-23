import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import Project from "./project";
import User from "./user";
import sequelize from "../sequelize-connection";

// for typeScript typing
export default class Rating extends Model<InferAttributes<Rating>, InferCreationAttributes<Rating>> {
  declare id: CreationOptional<number>;
  declare ratingType: string;
}

// allowNull defaults to true if not set
Rating.init(
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
    tableName: "ratings",
    timestamps: true,
    modelName: "Rating"
  }
);

Project.hasMany(Rating, { foreignKey: "projectID" });

Rating.belongsTo(User, { foreignKey: "userId" });
