import { Sequelize, DataTypes, Model } from "sequelize";
// const Comment = require('./comment')
// const Fund = require('./fund')
// const Project = require('./project')
// const Rating = require('./rating')
// path from seqalize root to db path
const sequelize = new Sequelize({ dialect: "sqlite", storage: "./src/database/makit.db", logging: false });
sequelize.query("PRAGMA journal_mode=WAL;");
// add logging: false to paramterized constructor of sequalize to disable logging

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
