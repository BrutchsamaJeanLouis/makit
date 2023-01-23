import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import Project from "./project";
import sequelize from "../sequelize-connection";

export default class Media extends Model<InferAttributes<Media>, InferCreationAttributes<Media>> {
  declare id: CreationOptional<number>;
  declare mediaType: string;
  declare mediaFormat: string;
  declare s3BucketKey: string;
  declare mediaUrl: string;
}

// allowNull defaults to true if not set
Media.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    mediaType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mediaFormat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    s3BucketKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mediaUrl: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "media",
    timestamps: true,
    modelName: "Media"
  }
);
// Media.belongsTo(Project, { foreignKey: 'projectID' })
Project.hasMany(Media, { foreignKey: "projectId" });
