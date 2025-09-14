import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const HashDetection = sequelize.define(
  "HashDetection",
  {
    Detect_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Hash_Input_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Detect_Label: {
      type: DataTypes.ENUM("Bad", "Good", "Suspicious"),
      allowNull: false,
    },
    Input_by_UserId: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    Detect_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Hash_Detection",
    timestamps: false,
  }
);

export default HashDetection;
