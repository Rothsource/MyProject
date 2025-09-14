const { hashMd5, hashSha1, hashSha256, hashSha512, filename } = require("./test.js");

const filePath = process.argv[2]; // file passed as argument

if (!filePath) {
  console.error("Usage: node cli.js <filePath>");
  process.exit(1);
}

(async () => {
  console.log("File:", filePath);
  console.log("MD5:    ", await hashMd5(filePath));
  console.log("SHA1:   ", await hashSha1(filePath));
  console.log("SHA256: ", await hashSha256(filePath));
  console.log("SHA512: ", await hashSha512(filePath));
  console.log("Filename: ", await filename(filePath));
})();