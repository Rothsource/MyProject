import funtions from "./request.js";
import Users from "./User.js";

// OTP Ban system variables
let otpAttempts = 0;
const MAX_OTP_ATTEMPTS = 3;
let otpBannedUntil = null;
let otpBanLevel = 0;
const baseDuration = 30 * 1000; // 30 seconds

// Request OTP (no ban system needed here, just requesting)
async function requestOtp(phone) {
  const phoneInput = phone.trim();
  const res = await funtions.requestotp(phoneInput);
  return res; 
}

// Verify OTP with ban system
async function verifyOtp(phone, otp) {
  const now = Date.now();

  // Check if user is currently banned from OTP verification
  if (otpBannedUntil && now < otpBannedUntil) {
    const remaining = otpBannedUntil - now;
    return { 
      success: false, 
      message: `Too many failed OTP attempts. Try again in ${Math.ceil(remaining / 1000)}s`,
      banDuration: remaining
    };
  }

  // If ban time has expired, reset the ban and clear stored OTP, then request new OTP
  if (otpBannedUntil && now >= otpBannedUntil) {
    otpBannedUntil = null;
    
    // Clear/reset the stored OTP in database when ban expires
    try {
      const clearResult = await funtions.clearStoredOtp(phone.trim());
      if (clearResult.success) {
        console.log('Stored OTP cleared after ban expiry');
        
        // Automatically request new OTP after clearing
        const newOtpResult = await funtions.requestotp(phone.trim());
        if (newOtpResult.success) {
          console.log('New OTP requested automatically after ban expiry');
        } else {
          console.log('Failed to request new OTP:', newOtpResult.message);
        }
      } else {
        console.log('Failed to clear stored OTP:', clearResult.message);
      }
    } catch (error) {
      console.log('Error clearing stored OTP:', error);
    }
  }

  const res = await funtions.checkotp(otp.trim(), phone.trim());

  if (!res.success) {
    otpAttempts += 1;

    if (otpAttempts >= MAX_OTP_ATTEMPTS) {
      otpBanLevel += 1;
      otpAttempts = 0;
      
      let newBanDuration;
      
      if (otpBanLevel <= 3) {
        // Progressive stage: 30s, 60s, 90s
        newBanDuration = baseDuration * otpBanLevel;
      } else if (otpBanLevel === 4) {
        // Random stage
        newBanDuration = baseDuration * 4; // 120s
      } else {
        // banLevel >= 5: Random power stage, then loop back to level 4
        const randomPower = Math.floor(Math.random() * 5) + 1;
        const previousDuration = baseDuration * 4;
        newBanDuration = Math.pow(previousDuration, randomPower);
        
        // Reset to level 4 to loop the random stage
        otpBanLevel = 4;
      }
      
      otpBannedUntil = now + newBanDuration;
      
      return { 
        success: false, 
        message: `Too many failed OTP attempts. You are banned for ${Math.ceil(newBanDuration / 1000)}s.`,
        banDuration: newBanDuration
      };
    }

    return { 
      success: false, 
      message: `Invalid OTP. ${MAX_OTP_ATTEMPTS - otpAttempts} attempts remaining.`
    };
  }

  // Successful OTP verification - reset everything
  otpAttempts = 0;
  otpBannedUntil = null;
  otpBanLevel = 0;

  return res; 
}

// Reset Password with ban system
async function resetPassword(phone, newPassword) {
  const now = Date.now();

  // Check if user is currently banned (reuse OTP ban for password reset)
  if (otpBannedUntil && now < otpBannedUntil) {
    const remaining = otpBannedUntil - now;
    return { 
      success: false, 
      message: `Too many failed attempts. Try again in ${Math.ceil(remaining / 1000)}s`,
      banDuration: remaining
    };
  }

  const user = new Users();

  if (!user.setPassword(newPassword.trim())) {
    return { success: false, message: "Weak password. Please choose stronger." };
  }

  const res = await funtions.NewPassword(newPassword.trim(), phone.trim());

  if (!res.success) {
    otpAttempts += 1;

    if (otpAttempts >= MAX_OTP_ATTEMPTS) {
      otpBanLevel += 1;
      otpAttempts = 0;
      
      let newBanDuration;
      
      if (otpBanLevel <= 3) {
        newBanDuration = baseDuration * otpBanLevel;
      } else if (otpBanLevel === 4) {
        newBanDuration = baseDuration * 4;
      } else {
        const randomPower = Math.floor(Math.random() * 5) + 1;
        const previousDuration = baseDuration * 4;
        newBanDuration = Math.pow(previousDuration, randomPower);
        otpBanLevel = 4;
      }
      
      otpBannedUntil = now + newBanDuration;
      
      return { 
        success: false, 
        message: `Too many failed password reset attempts. You are banned for ${Math.ceil(newBanDuration / 1000)}s.`,
        banDuration: newBanDuration
      };
    }

    return { 
      success: false, 
      message: `Password reset failed. ${MAX_OTP_ATTEMPTS - otpAttempts} attempts remaining.`
    };
  }

  // Successful password reset - reset ban data
  otpAttempts = 0;
  otpBannedUntil = null;
  otpBanLevel = 0;

  return res; 
}

export { requestOtp, verifyOtp, resetPassword };