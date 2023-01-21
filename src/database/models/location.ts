import { Sequelize, DataTypes, Model } from "sequelize";
import Project from "./project";
// path from seqalize root to db path
// const sequelize = new Sequelize({
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DATABASE,
//   host: process.env.DB_HOST,
//   dialect: process.env.DB_DIALECT,
//   logging: process.env.DB_QUERY_LOG === "true" ? true : false
// });
import sequelize from "../sequelize-connection";

export default class Location extends Model {}

// allowNull defaults to true if not set
Location.init(
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
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postcode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    // Other model options
    sequelize,
    tableName: "locations",
    timestamps: true,
    modelName: "Location"
  }
);
// Location.belongsTo(Project, { foreignKey: 'projectID' })
Project.hasOne(Location, { foreignKey: "projectId" });

// Location.sync({ alter: true })
//   .then(() => console.log("successfully synced location model"))
//   .catch((err: any) => console.log(err));
// module.exports = Location
