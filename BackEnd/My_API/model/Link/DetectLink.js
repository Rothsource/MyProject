
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const DetectLink = sequelize.define("DetectLink", {
  detect_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  links_id: {
    type: DataTypes.INTEGER,
  },
  input_links_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Detect_label: {
    type: DataTypes.ENUM("Bad", "Good", "Suspicious"),
    allowNull: false,
  },
  User_Id: {
    type: DataTypes.STRING(36),
    allowNull: false,
  },
  Detect_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "Detect_links",
  timestamps: false,
});

export default DetectLink;
