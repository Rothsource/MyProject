// models/InputFile.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const InputFile = sequelize.define("InputFile", {
  file_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  file_name: {
    type: DataTypes.STRING(255),
  },
  file_size: {
    type: DataTypes.BIGINT,
  },
  MD5: {
    type: DataTypes.STRING(32),
  },
  SHA1: {
    type: DataTypes.STRING(40),
  },
  SHA256: {
    type: DataTypes.STRING(64),
  },
  Input_files_Users: {
    type: DataTypes.STRING(36),
    allowNull: false,
  },
  Input_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "Input_Files",
  timestamps: false,
});

export default InputFile;
