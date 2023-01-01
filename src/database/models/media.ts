import { Sequelize, DataTypes, Model } from "sequelize";
import Project from "./project";
// const Project = require('./project')
// path from seqalize root to db path
const sequelize = new Sequelize({ dialect: "sqlite", storage: "./src/database/makit.db", logging: false });
sequelize.query("PRAGMA journal_mode=WAL;");

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

Media.sync({ alter: true })
  .then(() => console.log("successfully synced media model"))
  .catch((err: any) => console.log(err));
// module.exports = Media
