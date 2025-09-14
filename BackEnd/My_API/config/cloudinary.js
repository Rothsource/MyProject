import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from parent folder
dotenv.config({ path: resolve(__dirname, "../.env") });

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

//testing

// console.log('CLOUD_NAME:', process.env.CLOUD_NAME); // sanity check

// async function testConnection() {
//   try {
//     const result = await cloudinary.api.ping();
//     console.log("Cloudinary connection successful!", result);
//   } catch (err) {
//     console.error("Cloudinary connection failed:", err.message);
//   }
// }

// testConnection();

// async function uploadImage() {
//   try {
//     const result = await cloudinary.uploader.upload("./test.png", {
//       folder: "MyApp/Users",   
//     });

//     console.log("Image URL:", result.secure_url); 
//     return result.secure_url;
//   } catch (error) {
//     console.error("Upload error:", error);
//   }
// }
// uploadImage()

export default cloudinary;
