import { Sequelize, DataTypes, Model } from "sequelize";
import Project from "./project";
import User from "./user";
// const Project = require('./project')
// const User = require('./user')
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

export default class Fund extends Model {}

// allowNull defaults to true if not set
Fund.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
    // userID: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: User,
    //     key: 'id'
    //   }
    // },
    // projectID: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: Project,
    //     key: 'id'
    //   }
    // }
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
// User.hasMany(Fund)

// Fund.belongsTo(Project, { foreignKey: 'projectID' })
Project.hasMany(Fund, { foreignKey: "projectId" });

// Fund.sync({ alter: true })
//   .then(() => console.log("successfully synced fund model"))
//   .catch((err: any) => console.log(err));
// module.exports = Fund
