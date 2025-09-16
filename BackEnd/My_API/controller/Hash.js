import { HashInput, HashDetection,FileMD5, FileSHA1, FileSHA256 } from "../model/Index.js";


async function storeHash(hash, userId, type) {
  const newHash = await HashInput.create({
    Hash_Input: hash,
    Input_by_UserId: userId,
    Hash_Type: type,
  });

  console.log("Hash stored successfully:", {
    Input_id: newHash.Input_id,
    hash,
    userId,
    type,
  });

  return newHash.Input_id;
}

/**
 * Record hash detection
 */
async function recordDetection(inputId, label, userId) {
  const detection = await HashDetection.create({
    Hash_Input_Id: inputId,
    Detect_Label: label,
    Input_by_UserId: userId,
  });

  console.log("Detection recorded successfully:", { inputId, label, userId });
  return detection;
}

/**
 * Create hash endpoint
 */
export const createHash = async (req, res) => {
  try {
    const { hash } = req.body;
    const UserId = req.user.sub; 

    if (!hash || !UserId) return res.status(400).json({ error: "Hash and User ID are required" });
    console.log("Backend", hash);
    let hashType;
    if (hash.length === 32) hashType = "MD5";
    else if (hash.length === 40) hashType = "SHA1";
    else if (hash.length === 64) hashType = "SHA256";
    else return res.status(400).json({ error: "Invalid hash length" });

    const inputId = await storeHash(hash, UserId, hashType);

    return res.json({ success: true, inputId });
  } catch (error) {
    console.error("Error in createHash:", error);
    return res.status(500).json({ error: "Failed to store hash" });
  }
};

/**
 * Detect hash endpoint (fully ORM)
 */
export const detectHash = async (req, res) => {
  try {
    const { hash, inputid } = req.body;
    const userid = req.user.sub;

    if (!hash || !userid || !inputid) {
      return res.status(400).json({ error: "Hash, User ID, and Input ID are required" });
    }

    let label = "Good";
    console.log(`${hash}`);

    if (hash.length === 32) {
      const record = await FileMD5.findOne({ where: { md5: hash } });
      if (record?.is_bad === "Bad") label = "Bad";
    } else if (hash.length === 40) {
      const record = await FileSHA1.findOne({ where: { sha1: hash } });
      if (record?.is_bad === "Bad") label = "Bad";
    } else if (hash.length === 64) {
      const record = await FileSHA256.findOne({ where: { sha256: hash } });
      if (record?.is_bad === "Bad") label = "Bad";
    } else {
      label = "Not MD5, SHA1, and SHA256";
    }

    await recordDetection(inputid, label, userid);

    return res.json({ label });
  } catch (error) {
    console.error("Error in detectHash:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Standalone function for detecting hash without Express
 */
export const detectHashStandalone = async ({ hash, userid, inputid }) => {
  if (!hash || !userid || !inputid) throw new Error("Missing parameters");

  let label = "Good";

  if (hash.length === 32) {
    const record = await FileMD5.findOne({ where: { md5: hash } });
    if (record?.is_bad === "Bad") label = "Bad";
  } else if (hash.length === 40) {
    const record = await FileSHA1.findOne({ where: { sha1: hash } });
    if (record?.is_bad === "Bad") label = "Bad";
  } else if (hash.length === 64) {
    const record = await FileSHA256.findOne({ where: { sha256: hash } });
    if (record?.is_bad === "Bad") label = "Bad";
  } else {
    throw new Error("Invalid hash length");
  }

  await recordDetection(inputid, label, userid);
  return label;
};
