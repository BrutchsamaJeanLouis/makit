import { Sequelize } from "sequelize";
// path from seqalize root to db path
const sequelize = new Sequelize({
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: process.env.DB_QUERY_LOG === "true" ? true : false
});

export default sequelize;
