import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js"; 

const MaliciousLink = sequelize.define("MaliciousLink", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  URL: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  hahs_256: {
    type: DataTypes.STRING(64),
    unique: true,
  },
  threat_type: {
    type: DataTypes.STRING(50),
  },
  add_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  is_bad: {
    type: DataTypes.ENUM("Bad"),
  },
}, {
  tableName: "Malicious_Link",  
  timestamps: false,            
});

export default MaliciousLink;
