import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';

async function hashFile(fileUri) {
  try {
    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const [md5, sha1, sha256] = await Promise.all([
      Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.MD5, fileContent, { encoding: Crypto.CryptoEncoding.HEX }),
      Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, fileContent, { encoding: Crypto.CryptoEncoding.HEX }),
      Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, fileContent, { encoding: Crypto.CryptoEncoding.HEX }),
    ]);

    return { md5, sha1, sha256 };
  } catch (error) {
    console.error("Error computing file hashes:", error);
    throw error;
  }
}

export default hashFile;
