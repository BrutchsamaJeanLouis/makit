import { Sequelize, DataTypes, Model } from "sequelize";
import User from "./user";
// const Fund = require('./fund')
// const Media = require('./media')
// const Rating = require('./rating')
// const Location = require('./location')
// const Comment = require('./comment')
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

export default class Project extends Model {}

// allowNull defaults to true if not set
Project.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
      // defaultValue: "John Doe"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
    // userID: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: User,
    //     key: 'id'
    //   }
    // }
  },
  {
    // Other model options
    sequelize,
    tableName: "projects",
    timestamps: true,
    modelName: "Project"
  }
);
Project.belongsTo(User, { foreignKey: "userId" });
// Project.hasOne(User)

Project.sync({ alter: true })
  .then(() => console.log("successfully synced project model"))
  .catch((err: any) => console.log(err));
// module.exports = Project
