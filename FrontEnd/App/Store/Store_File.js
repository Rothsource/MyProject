import fs from "fs";
import readline from "readline";
import { file_upload } from "./request.js";

async function uploadfiles() {
  try {
    const filePath = process.argv[2] || "full_sha256.txt";
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const md5 = line.trim();
      if (!md5) continue; // skip empty lines

      try {
        const response = await file_upload(md5);
        console.log(`Uploaded: ${md5} ->`, response.message);
      } catch (err) {
        console.error(`Failed to upload ${md5}:`, err.message);
      }
    }

    console.log("✅ Finished uploading all MD5 hashes.");
  } catch (err) {
    console.error("Error reading file:", err.message);
  }
}

export default uploadfiles;