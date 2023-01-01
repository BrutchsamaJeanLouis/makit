import { Sequelize, DataTypes, Model } from "sequelize";
// const Comment = require('./comment')
// const Fund = require('./fund')
// const Project = require('./project')
// const Rating = require('./rating')
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
// add logging: false to paramterized constructor of sequalize to disable logging
import sequelize from "../sequelize-connection";

export default class User extends Model {}

// allowNull defaults to true if not set
// const User = sequelize.define('User', {
User.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
      // defaultValue: "John Doe"
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    // Other model options go here
    sequelize,
    tableName: "users",
    timestamps: true,
    modelName: "User"
  }
);

User.sync({ alter: true })
  .then(() => console.log("successfully synced user model"))
  .catch((err: any) => console.log(err));

// module.exports = User
