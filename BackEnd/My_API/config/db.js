import { Sequelize } from "sequelize";

const sequelize = new Sequelize("Phish_Guard", "root", "vector123pro", {
  host: "localhost",
  dialect: "mysql",
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

connectDB();

export default sequelize;
