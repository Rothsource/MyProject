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
import { router } from "expo-router";
import loginFunctions from "./Account/Login";


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 1024;
const BASE_HEIGHT = 1366;

const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

if (loginFunctions.userid){
  console.log("Available id");
}else{
  console.log("No user id!");
}

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [banTimeRemaining, setBanTimeRemaining] = useState(0);

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

  const handleLogin = async () => {
    // Check if user is banned
    if (banTimeRemaining > 0) {
      return;
    }

    // Basic validation
    if (!phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    setLoading(true);

    try {
      const result = await loginFunctions(phone, password);
      
      if (result.success) {
        // Reset ban time on successful login
        setBanTimeRemaining(0);
        Alert.alert("Success", "Login successful!", [
          {
            text: "OK",
            onPress: () => {
              router.push("/Home");
            },
          },
        ]);
      } else {
        // Check if user is now banned
        if (result.banDuration) {
          setBanTimeRemaining(Math.ceil(result.banDuration / 1000));
        }
        Alert.alert("Login Failed", result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    borderColor: isFocused ? "#4A90E2" : hasValue ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.2)",
    shadowColor: isFocused ? "#4A90E2" : "transparent",
    shadowOffset: {
      width: 0,
      height: isFocused ? 4 : 0,
    },
    shadowOpacity: isFocused ? 0.3 : 0,
    shadowRadius: isFocused ? 8 : 0,
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

  const isBanned = banTimeRemaining > 0;

  return (
    <LinearGradient
      colors={["#1E4368", "#1E4368"]}
      style={{
        flex: 1,
        padding: scale(20),
        paddingTop: 150,
        alignItems: "center",
      }}
    >
      {/* Title */}
      <View style={{ marginTop: verticalScale(80), marginBottom: verticalScale(40) }}>
        <Text
          style={{
            fontSize: moderateScale(34),
            color: "white",
            fontWeight: "bold",
            marginBottom: verticalScale(5),
          }}
        >
          Welcome Back
        </Text>
      </View>

      {/* Phone Input Container */}
      <View style={{ width: "100%", position: "relative" }}>
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          
          style={getInputStyle(phoneFocused, phone.length > 0)}
          editable={!loading}
        />
        {phoneFocused && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: verticalScale(20) * 2 + 40,
              borderRadius: moderateScale(16),
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: "#4A90E2",
              opacity: 0.6,
            }}
          />
        )}
      </View>

      {/* Password Input Container */}
      <View style={{ width: "100%", position: "relative" }}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
         
          style={getInputStyle(passwordFocused, password.length > 0)}
          editable={!loading}
        />
        {passwordFocused && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: verticalScale(20) * 2 + 40,
              borderRadius: moderateScale(16),
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: "#4A90E2",
              opacity: 0.6,
            }}
          />
        )}
      </View>

      {/* Login Button with Gradient - UPDATED */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading || isBanned}
        style={{ 
          width: "100%", 
          borderRadius: moderateScale(15),
          shadowColor: isBanned ? "#FF6B6B" : "#4A90E2",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: (loading || isBanned) ? 0.1 : 0.3,
          shadowRadius: 8,
          elevation: 6,
          opacity: (loading || isBanned) ? 0.7 : 1,
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
            paddingVertical: verticalScale(22),
            borderRadius: moderateScale(15),
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: moderateScale(20),
              fontWeight: "bold",
            }}
          >
            {isBanned 
              ? `Try again in ${formatTime(banTimeRemaining)}`
              : loading 
                ? "Signing in..." 
                : "Login"
            }
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity 
        style={{ marginTop: verticalScale(20) }} 
        onPress={() => router.push("/ForgotPassword")}
        disabled={loading}
      >
        <Text
          style={{
            color: loading ? "rgba(255,255,255,0.5)" : "#4A90E2",
            fontSize: moderateScale(16),
            fontWeight: "500",
          }}
        >
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Signup Option */}
      <View
        style={{
          flexDirection: "row",
          marginTop: verticalScale(15),
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: moderateScale(16),
          }}
        >
          Don't have an account?{" "}
        </Text>
        <TouchableOpacity 
          onPress={() => router.push("/Signup")}
          disabled={loading}
        >
          <Text
            style={{
              color: loading ? "rgba(255,255,255,0.5)" : "#4A90E2",
              fontWeight: "bold",
              fontSize: moderateScale(16),
            }}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}