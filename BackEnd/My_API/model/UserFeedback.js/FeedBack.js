import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Feedback = sequelize.define("Feedback", {
  Feedback_Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  User_Id: {
    type: DataTypes.STRING(36),
    allowNull: false,
  },
  User_Text: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  Input_Url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Input_FileUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Input_At: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "Feedback",
  timestamps: false,
});

export default Feedback;
