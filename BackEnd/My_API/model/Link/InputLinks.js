// models/InputLink.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const InputLink = sequelize.define("InputLink", {
  links_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  links: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  links_input_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  Input_Link_Users: {
    type: DataTypes.STRING(36),
    allowNull: false,
  },
  hahs_url256: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
}, {
  tableName: "Input_Links",   
  timestamps: false,         
});

import User from "../User/User.js";  

InputLink.belongsTo(User, {
  foreignKey: "Input_Link_Users",
  targetKey: "User_id",       
});

export default InputLink;
