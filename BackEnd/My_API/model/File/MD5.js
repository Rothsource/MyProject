// models/FileMD5.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const FileMD5 = sequelize.define("FileMD5", {
  file_detect_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  md5: {
    type: DataTypes.STRING(32),
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
  tableName: "file_MD5",
  timestamps: false,
});

export default FileMD5;
