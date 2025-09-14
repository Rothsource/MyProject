// models/FileSHA256.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const FileSHA256 = sequelize.define("FileSHA256", {
  sha256_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sha256: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  is_bad: {
    type: DataTypes.ENUM("Bad"),
    allowNull: false,
  },
  put_at5: { // column typo in DB schema, keep same for compatibility
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "file_SHA256",
  timestamps: false,
});

export default FileSHA256;
