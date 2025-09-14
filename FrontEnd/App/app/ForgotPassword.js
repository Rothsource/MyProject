import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { requestOtp, verifyOtp, resetPassword } from "./Account/forgetpassword";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 1024;
const BASE_HEIGHT = 1366;

const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export default function ForgotPassword() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [banTimeRemaining, setBanTimeRemaining] = useState(0);

  const [phoneFocused, setPhoneFocused] = useState(false);
  const [otpFocused, setOtpFocused] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  // Timer effect to update ban countdown
  useEffect(() => {
    let interval = null;
    
    if (banTimeRemaining > 0) {
      interval = setInterval(() => {
        setBanTimeRemaining((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [banTimeRemaining]);

  const getInputStyle = (isFocused, hasValue) => ({
    width: "100%",
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(20),
    fontSize: moderateScale(18),
    color: "white",
    backgroundColor: isFocused ? "rgba(74, 144, 226, 0.15)" : "rgba(255, 255, 255, 0.08)",
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(25),
    borderWidth: 1.5,
    borderColor: isFocused
      ? "#4A90E2"
      : hasValue
      ? "rgba(255, 255, 255, 0.3)"
      : "rgba(255, 255, 255, 0.2)",
    elevation: isFocused ? 4 : 0,
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const handleNext = async () => {
    // Check if user is banned
    if (banTimeRemaining > 0) {
      return;
    }

    setLoading(true);

    try {
      if (step === 1) {
        if (!phone) {
          Alert.alert("Error", "Enter your phone number");
          setLoading(false);
          return;
        }
        
        const res = await requestOtp(phone);
        if (res.success) {
          setStep(2);
        } else {
          Alert.alert("Error", res.message);
          // Check if banned from requestOtp
          if (res.banDuration) {
            setBanTimeRemaining(Math.ceil(res.banDuration / 1000));
          }
        }
      } else if (step === 2) {
        if (!otp) {
          Alert.alert("Error", "Enter OTP");
          setLoading(false);
          return;
        }
        
        const res = await verifyOtp(phone, otp);
        if (res.success) {
          setStep(3);
          // Reset ban time on successful verification
          setBanTimeRemaining(0);
        } else {
          Alert.alert("Error", res.message);
          // Check if user is now banned
          if (res.banDuration) {
            setBanTimeRemaining(Math.ceil(res.banDuration / 1000));
          }
        }
      } else if (step === 3) {
        if (!newPassword || !confirmPassword) {
          Alert.alert("Error", "Fill all fields");
          setLoading(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          Alert.alert("Error", "Passwords do not match");
          setLoading(false);
          return;
        }

        const res = await resetPassword(phone, newPassword);
        if (res.success) {
          Alert.alert("Success", res.message || "Password reset successfully");
          router.push("/Login");
          // Reset ban time on successful password reset
          setBanTimeRemaining(0);
        } else {
          Alert.alert("Error", res.message);
          // Check if user is now banned
          if (res.banDuration) {
            setBanTimeRemaining(Math.ceil(res.banDuration / 1000));
          }
        }
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isBanned = banTimeRemaining > 0;
  const isDisabled = loading || isBanned;

  const getButtonText = () => {
    if (isBanned) {
      return `Try again in ${formatTime(banTimeRemaining)}`;
    }
    if (loading) {
      return step === 1 ? "Sending..." : step === 2 ? "Verifying..." : "Resetting...";
    }
    return step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Reset Password";
  };

  return (
    <LinearGradient
      colors={["#1E4368", "#1E4368"]}
      style={{
        flex: 1,
        padding: scale(20),
        paddingTop: 250,
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      <View
        style={{
          width: "100%",
          borderRadius: moderateScale(20),
        }}
      >
        <Text
          style={{
            fontSize: moderateScale(28),
            color: "white",
            fontWeight: "bold",
            marginBottom: verticalScale(30),
            textAlign: "center",
          }}
        >
          Forgot Password
        </Text>

        {step === 1 && (
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="rgba(255,255,255,0.5)"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => setPhoneFocused(false)}
            style={getInputStyle(phoneFocused, phone.length > 0)}
            editable={!isDisabled}
          />
        )}

        {step === 2 && (
          <TextInput
            placeholder="Otp is sent..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            onFocus={() => setOtpFocused(true)}
            onBlur={() => setOtpFocused(false)}
            style={getInputStyle(otpFocused, otp.length > 0)}
            editable={!isDisabled}
          />
        )}

        {step === 3 && (
          <>
            <TextInput
              placeholder="New Password"
              placeholderTextColor="rgba(255,255,255,0.5)"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              onFocus={() => setNewPasswordFocused(true)}
              onBlur={() => setNewPasswordFocused(false)}
              style={getInputStyle(newPasswordFocused, newPassword.length > 0)}
              editable={!isDisabled}
            />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="rgba(255,255,255,0.5)"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setConfirmPasswordFocused(true)}
              onBlur={() => setConfirmPasswordFocused(false)}
              style={getInputStyle(confirmPasswordFocused, confirmPassword.length > 0)}
              editable={!isDisabled}
            />
          </>
        )}

        <TouchableOpacity
          onPress={handleNext}
          disabled={isDisabled}
          style={{
            width: "100%",
            borderRadius: moderateScale(15),
            marginTop: verticalScale(10),
            shadowColor: isBanned ? "#FF6B6B" : "#4A90E2",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDisabled ? 0.1 : 0.3,
            shadowRadius: 8,
            elevation: 6,
            opacity: isDisabled ? 0.7 : 1,
          }}
        >
          <LinearGradient
            colors={
              isBanned 
                ? ["#FF6B6B", "#E55555"] // Red gradient when banned
                : loading 
                  ? ["#6B6B6B", "#5A5A5A"] // Gray gradient when loading
                  : ["#4A90E2", "#357ABD"] // Normal blue gradient
            }
            style={{
              paddingVertical: verticalScale(18),
              borderRadius: moderateScale(15),
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: moderateScale(18),
                fontWeight: "bold",
              }}
            >
              {getButtonText()}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}