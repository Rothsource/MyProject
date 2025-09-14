import { userlogin, userInfo } from './request.js';
import { saveAccessToken, saveRefreshToken } from '../../TokensStorage/storeTokens.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

let attempts = 0;
const MAX_ATTEMPTS = 3;
let bannedUntil = null;
let banLevel = 0;
const baseDuration = 30 * 1000; 

const saveBanData = async (banLevel, bannedUntil) => {
  try {
    await AsyncStorage.setItem('banData', JSON.stringify({
      banLevel,
      bannedUntil,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.log('Error saving ban data:', error);
  }
};

const loadBanData = async () => {
  try {
    const banData = await AsyncStorage.getItem('banData');
    if (banData) {
      const parsed = JSON.parse(banData);
      banLevel = parsed.banLevel || 0;
      bannedUntil = parsed.bannedUntil;
      return true;
    }
  } catch (error) {
    console.log('Error loading ban data:', error);
  }
  return false;
};

// Clear ban data from storage
const clearBanData = async () => {
  try {
    await AsyncStorage.removeItem('banData');
  } catch (error) {
    console.log('Error clearing ban data:', error);
  }
};

async function loginFunctions(phone, password) {
  // Load ban data on first call
  await loadBanData();
  
  const now = Date.now();

  if (bannedUntil && now < bannedUntil) {
    const remaining = bannedUntil - now;
    return { 
      success: false, 
      message: `Too many failed attempts. Try again in ${Math.ceil(remaining / 1000)}s`,
      banDuration: remaining
    };
  }

  if (bannedUntil && now >= bannedUntil) {
    bannedUntil = null;
    await saveBanData(banLevel, null); // Update storage
  }

  const result = await userlogin(phone, password);

  if (!result.success) {
    attempts += 1;

    if (attempts >= MAX_ATTEMPTS) {
      banLevel += 1;
      attempts = 0;
      
      let newBanDuration;
      
      if (banLevel <= 3) {
        // Progressive stage: 30s, 60s, 90s
        newBanDuration = baseDuration * banLevel;
      } else if (banLevel === 4) {
        // Random stage: user gets random attempts (1-3)
        const randomAttempts = Math.floor(Math.random() * 3) + 1;
        newBanDuration = baseDuration * 4; // 120s
      } else {

        const randomPower = Math.floor(Math.random() * 5) + 1;
        const previousDuration = baseDuration * 4;
        newBanDuration = Math.pow(previousDuration, randomPower);
        
        // reset to level 4 to loop the random stage
        banLevel = 4;
      }
      
      bannedUntil = now + newBanDuration;
      
      // save ban data to storage
      await saveBanData(banLevel, bannedUntil);
      
      return { 
        success: false, 
        message: `Too many failed attempts. You are banned for ${Math.ceil(newBanDuration / 1000)}s.`,
        banDuration: newBanDuration
      };
    }

    return { 
      success: false, 
      message: `Invalid credentials. ${MAX_ATTEMPTS - attempts} attempts remaining.`
    };
  }

  // Successful login - reset everything
  attempts = 0;
  bannedUntil = null;
  banLevel = 0;
  
  // Clear ban data from storage
  await clearBanData();
  await saveAccessToken(result.tokens.accessToken, result.tokens.expirationIn);
  await saveRefreshToken(result.tokens.refreshToken);

  userInfo();

  return { success: true, userid: result.user.id };
}

export default loginFunctions;