import Users from "./User.js";
import { checkPhonenumber, createUserAndSend } from "./request.js";
import { saveAccessToken, saveRefreshToken } from "../../TokensStorage/storeTokens.js";

// Step 1: check phone number
export async function checkPhoneNumber(phoneInput) {
  const user = new Users(null, null, null);
  if (!user.setPhoneNumber(phoneInput)) {
    return { success: false, error: "Invalid phone number" };
  }

  const res = await checkPhonenumber(phoneInput); // ✅ named import
  if (!res.success) return { success: false, error: "Phone already exists" };

  return { success: true, phone: phoneInput };
}

// Step 2: password validation
export function validatePassword(password, confirmPassword) {
  const user = new Users(null, null, null);
  if (!user.setPassword(password)) return false;
  if (password !== confirmPassword) return false;
  return true;
}

// Step 3: username validation
export function validateUsername(usernameInput) {
  const user = new Users(null, null, null);
  if (!user.setUsername(usernameInput)) return false;
  return true;
}

// Step 4: signup
export async function doSignup(phone, password, username, profileImageData = null) {
  const user = new Users(null, null, null);
  user.setUsername(username);

  const result = await createUserAndSend(
    user.getUsername(),
    phone,
    password,
    profileImageData 
  );

  if (!result.success) return { success: false, error: result.error };

  await saveAccessToken(result.tokens.accessTokens, result.tokens.expiratoinIn);
  await saveRefreshToken(result.tokens.refreshTokens);

  return { success: true, message: "Signup completed!", name: result.user.name ,picUrl: result.proImage, userId: result.user.id };
}
