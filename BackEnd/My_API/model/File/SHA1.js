// models/FileSHA1.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const FileSHA1 = sequelize.define("FileSHA1", {
  sha1_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sha1: {
    type: DataTypes.STRING(48),
    allowNull: false,
  },
  is_bad: {
    type: DataTypes.ENUM("Bad"),
    allowNull: false,
  },
  put_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "file_SHA1",
  timestamps: false,
});

export default FileSHA1;
