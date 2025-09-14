import * as SecureStore from 'expo-secure-store';

// Keys for SecureStore
const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';
const ACCESS_TOKEN_EXP_KEY = 'ACCESS_TOKEN_EXP';

// Save access token and expiration
export async function saveAccessToken(token, expiresInSeconds) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);

  // Calculate expiration timestamp
  const expirationTime = Date.now() + expiresInSeconds * 1000;
  await SecureStore.setItemAsync(ACCESS_TOKEN_EXP_KEY, expirationTime.toString());
}

// Save refresh token
export async function saveRefreshToken(token) {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
}

// Get access token (returns null if expired)
export async function getAccessToken() {
  const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  const exp = await SecureStore.getItemAsync(ACCESS_TOKEN_EXP_KEY);

  if (!token || !exp) return null;

  const expirationTime = parseInt(exp, 10);
  if (Date.now() >= expirationTime) {
    await deleteAccessToken();
    return null;
  }

  return token;
}

// Get refresh token
export async function getRefreshToken() {
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

// Delete tokens
export async function deleteAccessToken() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_EXP_KEY);
}

export async function deleteRefreshToken() {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

// Clear all tokens
export async function clearAllTokens() {
  await deleteAccessToken();
  await deleteRefreshToken();
}
