import sequelize from "../config/db.js";
import User from "./User/User.js";
import InputLink from "./Link/InputLinks.js";
import MaliciousLink from "./Link/MaliciousLink.js";
import DetectLink from "./Link/DetectLink.js";
import InputFile from "./File/InputFile.js";
import FileMD5 from "./File/MD5.js";
import FileSHA1 from "./File/SHA1.js";
import FileSHA256 from "./File/MD5.js";
import DetectFile from "./File/DetectFile.js";
import HashDetection from "./Hash/HashDetection.js";
import HashInput from "./Hash/HashInput.js";

//Links
DetectLink.belongsTo(MaliciousLink, { foreignKey: "links_id" });
MaliciousLink.hasMany(DetectLink, { foreignKey: "links_id" });

DetectLink.belongsTo(InputLink, { foreignKey: "input_links_id" });
InputLink.hasMany(DetectLink, { foreignKey: "input_links_id" });

DetectLink.belongsTo(User, { foreignKey: "User_Id" });
User.hasMany(DetectLink, { foreignKey: "User_Id" });

//Files
DetectFile.belongsTo(InputFile, { foreignKey: "file_input_id" });
DetectFile.belongsTo(FileMD5, { foreignKey: "md5_id" });

DetectFile.belongsTo(FileSHA1, { foreignKey: "sha1_id" });
DetectFile.belongsTo(FileSHA256, { foreignKey: "sha256_id" });

DetectFile.belongsTo(User, { foreignKey: "Input_by_UserId", targetKey: "User_id" });

//input file
InputFile.belongsTo(User, { foreignKey: "Input_files_Users", targetKey: "User_id"});

//Hash
HashInput.belongsTo(User, { foreignKey: "Input_by_UserId", targetKey: "User_id"});
User.hasMany(HashInput, { foreignKey: "Input_by_UserId" });

HashDetection.belongsTo(HashInput, { foreignKey: "Hash_Input_Id"});
HashInput.hasMany(HashDetection, { foreignKey: "Hash_Input_Id"});

HashDetection.belongsTo(User, { foreignKey: "Input_by_UserId",  targetKey: "User_id" });
User.hasMany(HashDetection, { foreignKey: "Input_by_UserId"});


export {
  User,
  InputLink,
  MaliciousLink,
  DetectLink,
  InputFile,
  FileMD5,
  FileSHA1,
  FileSHA256,
  DetectFile,
  HashDetection,
  HashInput,
};
