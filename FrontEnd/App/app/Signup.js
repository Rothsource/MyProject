import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

// ✅ Import helper functions
import {
  checkPhoneNumber,
  validatePassword,
  doSignup,
  validateUsername,
} from "./Account/Signup";

if (doSignup.userId){
  console.log("Available id!");
}else{
  console.log("No id");
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 1024;
const BASE_HEIGHT = 1366;

const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Convert image URI to Base64
async function uriToBase64(uri) {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const ext = uri.split(".").pop().toLowerCase();
    const mimeType =
      ext === "png"
        ? "image/png"
        : ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : ext === "heic"
        ? "image/heic"
        : ext === "webp"
        ? "image/webp"
        : "image/jpeg";

    return `data:${mimeType};base64,${base64}`;
  } catch (err) {
    console.error("Base64 conversion failed:", err);
    return null;
  }
}

export default function Signup() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const getInputStyle = (hasValue) => ({
    width: "100%",
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(20),
    fontSize: moderateScale(18),
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(25),
    borderWidth: 1.5,
    borderColor: hasValue ? "#4A90E2" : "rgba(255, 255, 255, 0.2)",
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
    if (loading) return; // prevent double taps
    if (step === 1) {
      if (!phone.trim()) {
        Alert.alert("Error", "Please enter phone number");
        return;
      }
      setLoading(true);
      try {
        const res = await checkPhoneNumber(phone);
        if (!res.success) {
          Alert.alert("Error", res.error);
          return;
        }
        setStep(2);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Server error, please try again");
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      if (!validatePassword(newPassword, confirmPassword)) {
        Alert.alert("Error", "Passwords do not match or are too weak");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!validateUsername(name)) {
        Alert.alert("Error", "Name must be 6–50 characters");
        return;
      }
      setStep(4);
    } else if (step === 4) {
      setLoading(true);
      try {
        let base64Image = null;
        if (profileImage) {
          base64Image = await uriToBase64(profileImage);
        }

        const result = await doSignup(phone, newPassword, name, base64Image);
        if (!result.success) {
          Alert.alert("Error", result.error);
          return;
        }

        Alert.alert("Success", result.message);
        router.replace("/Home");
      } catch (error) {
        console.error("Signup error:", error);
        Alert.alert("Error", "Signup failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

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
      <Text
        style={{
          fontSize: moderateScale(34),
          color: "white",
          fontWeight: "bold",
          marginBottom: verticalScale(40),
        }}
      >
        {step === 1
          ? "Enter Phone Number"
          : step === 2
          ? "Create Password"
          : step === 3
          ? "Enter Your Name"
          : "Upload Profile Picture (Optional)"}
      </Text>

      {/* Step 1: Phone */}
      {step === 1 && (
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="rgba(255,255,255,0.5)"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          style={getInputStyle(phone.length > 0)}
        />
      )}

      {/* Step 2: Password */}
      {step === 2 && (
        <>
          <TextInput
            placeholder="New Password"
            placeholderTextColor="rgba(255,255,255,0.5)"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            style={getInputStyle(newPassword.length > 0)}
          />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="rgba(255,255,255,0.5)"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={getInputStyle(confirmPassword.length > 0)}
          />
        </>
      )}

      {/* Step 3: Name */}
      {step === 3 && (
        <TextInput
          placeholder="Your Name"
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={name}
          onChangeText={setName}
          style={getInputStyle(name.length > 0)}
        />
      )}

      {/* Step 4: Profile Picture */}
      {step === 4 && (
        <View style={{ alignItems: "center" }}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 75,
                marginBottom: verticalScale(20),
              }}
            />
          ) : (
            <View
              style={{
                width: 150,
                height: 150,
                borderRadius: 75,
                backgroundColor: "rgba(255,255,255,0.1)",
                marginBottom: verticalScale(20),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white" }}>No Image</Text>
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Upload / Change Image */}
            <TouchableOpacity onPress={pickImage}>
              <LinearGradient
                colors={["#4A90E2", "#357ABD"]}
                style={{
                  paddingVertical: verticalScale(15),
                  paddingHorizontal: scale(30),
                  borderRadius: moderateScale(12),
                  marginBottom: verticalScale(20),
                  marginRight: scale(15),
                }}
              >
                <Text style={{ color: "white", fontSize: moderateScale(18) }}>
                  {profileImage ? "Change Image" : "Choose Image"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Skip / Cancel */}
            <TouchableOpacity
              onPress={async () => {
                setProfileImage(null);
                setLoading(true);
                try {
                  const result = await doSignup(phone, newPassword, name, null);
                  if (!result.success) {
                    Alert.alert("Error", result.error);
                    return;
                  }
                  Alert.alert("Success", result.message);
                  router.replace("/Home");
                } catch (error) {
                  console.error("Signup error:", error);
                  Alert.alert("Error", "Signup failed. Please try again.");
                } finally {
                  setLoading(false);
                }
              }}
            >
              <LinearGradient
                colors={["#E74C3C", "#C0392B"]}
                style={{
                  paddingVertical: verticalScale(15),
                  paddingHorizontal: scale(30),
                  borderRadius: moderateScale(12),
                  marginBottom: verticalScale(20),
                }}
              >
                <Text style={{ color: "white", fontSize: moderateScale(18) }}>
                  Skip
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Next / Finish button */}
      <TouchableOpacity onPress={handleNext} style={{ width: "100%" }} disabled={loading}>
        <LinearGradient
          colors={["#4A90E2", "#357ABD"]}
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
            {step === 4 ? "Finish" : "Next"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Back to login */}
      {step === 1 && (
        <View style={{ flexDirection: "row", marginTop: verticalScale(20) }}>
          <Text
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: moderateScale(16),
            }}
          >
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/Login")}>
            <Text
              style={{
                color: "#000000ff",
                fontWeight: "bold",
                fontSize: moderateScale(16),
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
}
