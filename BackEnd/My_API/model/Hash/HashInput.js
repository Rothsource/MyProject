import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const HashInput = sequelize.define(
  "HashInput",
  {
    Input_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Hash_Type: {
      type: DataTypes.ENUM("MD5", "SHA1", "SHA256"),
      allowNull: false,
    },
    Hash_Input: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    Input_by_UserId: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    Input_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Hash_Input",
    timestamps: false,
  }
);

export default HashInput;
