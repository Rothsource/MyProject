import {InputFile, FileMD5, FileSHA1, FileSHA256, DetectFile} from "../model/Index.js"

// --- Helpers inside the same file ---
async function store_file(file_name, file_size, user_id, md5, sha1, sha256) {
  const newFile = await InputFile.create({
    file_name,
    file_size,
    Input_files_Users: user_id,
    MD5: md5,
    SHA1: sha1,
    SHA256: sha256,
  });

  return {
    file_id: newFile.file_id,
    file_name,
    file_size,
    user_id,
    md5,
    sha1,
    sha256,
  };
}

async function record_detect(file_input_id, md5_id, sha1_id, sha256_id, detect_label, user_id) {
  await DetectFile.create({
    file_input_id,
    md5_id: md5_id || null,
    sha1_id: sha1_id || null,
    sha256_id: sha256_id || null,
    detect_label,
    Input_by_UserId: user_id,
  });
}

// --- API Endpoints ---
export const createFile = async (req, res) => {
  try {
    const { name, size, userid, hash_md5, hash_sha1, hash_sha256 } = req.body;
    if (!name || !userid) return res.status(400).json({ error: "File name and user ID are required!" });

    const newFile = await store_file(name, size || 0, userid, hash_md5, hash_sha1, hash_sha256);
    return res.status(201).json({ success: true, message: "File created successfully", file_id: newFile.file_id });
  } catch (error) {
    console.error("Error creating file:", error);
    res.status(500).json({ error: "Failed to create file" });
  }
};

export const detectFile = async (req, res) => {
  try {
    const { userid, file_input_id, md5, sha1, sha256 } = req.body;
    if (!userid || !file_input_id) return res.status(400).json({ error: "User ID and file input ID are required!" });

    const link_md5 = await FileMD5.findOne({ where: { md5 } });
    const link_sha1 = await FileSHA1.findOne({ where: { sha1 } });
    const link_sha256 = await FileSHA256.findOne({ where: { sha256 } });

    let label = "Good";
    if ((link_md5 && link_md5.is_bad === "Bad") ||
        (link_sha1 && link_sha1.is_bad === "Bad") ||
        (link_sha256 && link_sha256.is_bad === "Bad")) {
      label = "Bad";
    }

    await record_detect(
      file_input_id,
      link_md5 ? link_md5.file_detect_id : null,
      link_sha1 ? link_sha1.sha1_id : null,
      link_sha256 ? link_sha256.sha256_id : null,
      label,
      userid
    );

    return res.json({ label });
  } catch (error) {
    console.error("Error detecting file:", error);
    res.status(500).json({ error: "Failed to detect file" });
  }
};
