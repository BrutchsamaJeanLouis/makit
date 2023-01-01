import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import Project from "./project";
import User from "./user";
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

export default class Comment extends Model {}

// allowNull defaults to true if not set
Comment.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    value: {
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
    tableName: "comments",
    timestamps: true,
    modelName: "Comment"
  }
);
Comment.belongsTo(User, { foreignKey: "userId" });
// User.hasMany(Comment)// perered as assicia

// Comment.belongsTo(Project, { foreignKey: 'projectID' })
Project.hasMany(Comment, { foreignKey: "projectId" });

Comment.sync({ alter: true })
  .then(() => console.log("successfully synced comment model"))
  .catch((err: any) => console.log(err));
// module.exports = Comment
