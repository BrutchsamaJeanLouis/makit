import { Sequelize, DataTypes, Model } from "sequelize";
import Project from "./project";
// const Project = require('./project')
// path from seqalize root to db path
// const sequelize = new Sequelize({
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DATABASE,
//   host: process.env.DB_HOST,
//   dialect: process.env.DB_DIALECT,
//   logging: process.env.DB_QUERY_LOG === "true" ? true : false
// });
// sequelize.query("PRAGMA journal_mode=WAL;");
import sequelize from "../sequelize-connection";

export default class Media extends Model {}

// allowNull defaults to true if not set
Media.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    // projectID: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: Project,
    //     key: 'id'
    //   }
    // },
    mediaType: {
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

// Media.sync({ alter: true })
//   .then(() => console.log("successfully synced media model"))
//   .catch((err: any) => console.log(err));
// module.exports = Media
