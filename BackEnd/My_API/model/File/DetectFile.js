// models/DetectFile.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const DetectFile = sequelize.define("DetectFile", {
  detect_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  file_input_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  md5_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  sha1_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  sha256_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  detect_label: {
    type: DataTypes.ENUM("Bad", "Good", "Suspicious"),
    allowNull: false,
  },
  Input_by_UserId: {
    type: DataTypes.STRING(36),
    allowNull: false,
  },
  detect_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "detect_files",
  timestamps: false,
});



export default DetectFile;
