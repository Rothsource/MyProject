import login from "../Account/Login.js";
import { file_input, File_Detection } from "./request.js";  
import path from "path";
import { hashMd5, hashSha1, hashSha256 } from "./HashFile/hash_al.js";

async function inputfiles(ask) {
  const loginResult = await login(ask);

  if (!loginResult.success) {
    console.log("Authentication failed. Cannot proceed with file input.");
    return;
  }

  const input = (await ask("Enter File: ")).trim();
  const name = path.basename(input);

  try {
    const md5 = await hashMd5(input);
    const sha1 = await hashSha1(input);
    const sha256 = await hashSha256(input);

    const result = await file_input(name, loginResult.userid, md5, sha1, sha256);

    const detection = await File_Detection(result.file_id, loginResult.userid, md5, sha1, sha256);

    console.log("\n=======================================");
    console.log('Detection label:', detection.label); 
    console.log("=======================================\n");
  } catch (error) {
    console.error("Error:", error);
  }
}

export default inputfiles;
