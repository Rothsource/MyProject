import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const User = sequelize.define("User", {
  User_id: {
    type: DataTypes.STRING(36),   // VARCHAR(36)
    primaryKey: true,
    allowNull: false,
  },
  User_Name: {
    type: DataTypes.STRING(100),  // VARCHAR(100)
    allowNull: false,
  },
  User_PhoneNumber: {
    type: DataTypes.STRING(20),   // VARCHAR(20)
    allowNull: false,
    unique: true,
  },
  User_Password: {
    type: DataTypes.STRING(255),  // VARCHAR(255)
    allowNull: false,
  },
  Salt: {
    type: DataTypes.STRING(32),   // VARCHAR(32)
    allowNull: false,
  },
  OTP: {
    type: DataTypes.STRING(8),    // VARCHAR(8)
    allowNull: true,
  },
  OTP_CreateAt: {
    type: DataTypes.DATE,         // DATETIME
    allowNull: true,
  },
  create_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,  // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  },
  login_time: {
    type: DataTypes.DATE,         // TIMESTAMP NULL
    allowNull: true,
  },
  update_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,  // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  },
  pic_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  tableName: "Users",
  timestamps: false, // we already have create_time/update_time in DB
});

export default User;
