import React, { useRef, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  Switch,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { usersInfo, updateUserInfo } from "./userInfo"; // Import updateUserInfo function

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base dimensions for scaling
const BASE_WIDTH = 1024;
const BASE_HEIGHT = 1366;
const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// Menu dimensions
const MENU_WIDTH = SCREEN_WIDTH * 0.45;
const MENU_HEIGHT = SCREEN_HEIGHT + 100;
const MENU_TOP_OFFSET = verticalScale(0);

export default function Menu({ isOpen, toggleDrawer }) {

  const [user, setUser] = useState({
    name: "",
    phone_number: "",
    pic_url: "",
  });

  async function loadUser() {
    const user = await usersInfo(); // await the async function
    // console.log("User name:", user.name);
    // console.log("User phone:", user.phone_number);
    // console.log("User pic:", user.pic_url);
    setUser(user);
  }

  // Update user info function
  const updateProfile = async (newName, newPicUrl) => {
    try {
      // Call the update function from userInfo
      await updateUserInfo({ 
        name: newName || user.name, 
        pic_url: newPicUrl || user.pic_url 
      });
      
      // Update local state immediately
      setUser(prevUser => ({
        ...prevUser,
        name: newName || prevUser.name,
        pic_url: newPicUrl || prevUser.pic_url
      }));
      
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const ImageProfile = user.pic_url;
  const isPremium = "Normal User";
  const userName = user.name;

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  
  // Remove these unused states since we're using user state directly
  // const [profileImage, setProfileImage] = useState(ImageProfile);
  // const [Name, setName] = useState(userName)

  // 🔥 Feedback modal states
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackUrl, setFeedbackUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const drawerAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const menuItemsAnim = useRef(new Animated.Value(0)).current;

  const handleLogin = () => router.push("/Login");
  const handleSignup = () => router.push("/Signup");
  const handlePremium = () => router.push("/Premuim");

  const handleAccountPress = () => {
    Alert.alert(
      "Account",
      "Choose an option",
      [
        { text: "Login", onPress: handleLogin },
        { text: "Signup", onPress: handleSignup },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  // 🔥 Open File Picker
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (result.type === "success") {
        setSelectedFile(result);
        Alert.alert("File Selected", result.name);
      }
    } catch (error) {
      Alert.alert("Error", "Unable to pick file.");
    }
  };

  // 🔥 Handle Feedback Submit
  const handleSubmitFeedback = () => {
    if (!feedbackText.trim() && !feedbackUrl.trim() && !selectedFile) {
      Alert.alert("Error", "Please provide feedback, a URL, or a file.");
      return;
    }

    console.log("Feedback:", feedbackText);
    console.log("URL:", feedbackUrl);
    console.log("File:", selectedFile);

    // 🔥 Here you can send this data to your backend for analysis
    Alert.alert("Submitted", "Thank you for your feedback!");
    setFeedbackText("");
    setFeedbackUrl("");
    setSelectedFile(null);
    setShowFeedback(false);
  };

  useEffect(() => {
      loadUser();
  }, []);

  // Add effect to reload user data when the menu opens (optional - for real-time updates)
  useEffect(() => {
    if (isOpen) {
      loadUser(); // Refresh user data when menu opens
      
      Animated.parallel([
        Animated.timing(drawerAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(overlayAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        Animated.timing(menuItemsAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    } else {
      Animated.parallel([
        Animated.timing(drawerAnim, { toValue: -MENU_WIDTH, duration: 150, useNativeDriver: true }),
        Animated.timing(overlayAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(menuItemsAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [isOpen]);

  const menuItems = [
    {
      title: "Night Mode",
      icon: "🌙",
      subtitle: isDarkMode ? "Dark theme enabled" : "Dark theme",
      onPress: () => setIsDarkMode(!isDarkMode),
      hasToggle: true,
      toggleValue: isDarkMode,
    },
    {
      title: "Language",
      icon: "🌐",
      subtitle: isEnglish ? "English" : "Khmer",
      onPress: () => setIsEnglish(!isEnglish),
      hasToggle: true,
      toggleValue: isEnglish,
    },
    {
      title: "Premium",
      icon: "👑",
      subtitle: "Upgrade for more features",
      onPress: handlePremium,
    },
    {
      title: "Settings",
      icon: "⚙️",
      subtitle: "Preferences",
      onPress: () => console.log("Settings pressed"),
    },
    {
      title: "Feedback",
      icon: "💬",
      subtitle: "Help us improve",
      onPress: () => setShowFeedback(true), // 🔥 Open Feedback Modal
    },
    {
      title: "Account",
      icon: "👤",
      subtitle: "Signup or Login",
      onPress: handleAccountPress,
    },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            opacity: overlayAnim,
            zIndex: 4,
          }}
        >
          <TouchableOpacity style={{ flex: 1 }} onPress={toggleDrawer} activeOpacity={1} />
        </Animated.View>
      )}

      {/* Drawer */}
      <Animated.View
        style={{
          position: "absolute",
          top: MENU_TOP_OFFSET,
          width: MENU_WIDTH,
          height: MENU_HEIGHT,
          left: 0,
          transform: [{ translateX: drawerAnim }],
          zIndex: 5,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#0F2A44",
            borderTopRightRadius: scale(50),
            borderBottomRightRadius: scale(50),
            shadowColor: "#000",
            shadowOffset: { width: 2, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          {/* Header */}
          <View style={{ padding: scale(20), alignItems: "center", paddingTop: verticalScale(30) }}>
            <Image
              source={{uri: user.pic_url}} // Use user.pic_url directly for automatic updates
              style={{
                width: scale(80),
                height: scale(80),
                borderRadius: scale(40),
                borderWidth: scale(3),
                borderColor: "#fff",
                marginTop: verticalScale(50),
              }}
            />
            <Text style={{ color: "#fff", fontSize: moderateScale(18), fontWeight: "bold", marginTop: verticalScale(15) }}>
              {user.name} {/* Use user.name directly for automatic updates */}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: moderateScale(14), marginTop: verticalScale(5) }}>
              {isPremium}
            </Text>
          </View>

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: "rgba(255,255,255,0.2)",
              marginHorizontal: scale(20),
              marginVertical: verticalScale(10),
            }}
          />

          {/* Menu Items */}
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: verticalScale(20) }}>
            {menuItems.map((item, index) => (
              <Animated.View
                key={index}
                style={{
                  transform: [
                    {
                      translateX: menuItemsAnim.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] }),
                    },
                  ],
                  opacity: menuItemsAnim,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    item.onPress();
                    if (!item.hasToggle) toggleDrawer();
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: scale(15),
                    marginHorizontal: scale(15),
                    marginVertical: verticalScale(10),
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: moderateScale(18), marginRight: scale(15) }}>{item.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: "#fff", fontSize: moderateScale(16), fontWeight: "500" }}>{item.title}</Text>
                    <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: moderateScale(12), marginTop: verticalScale(2) }}>
                      {item.subtitle}
                    </Text>
                  </View>
                  {item.hasToggle && (
                    <Switch
                      value={item.toggleValue}
                      onValueChange={item.onPress}
                      trackColor={{ false: "rgba(255,255,255,0.2)", true: "#4CAF50" }}
                      thumbColor="#fff"
                      style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                    />
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </View>
      </Animated.View>

      {/* 🔥 Feedback Modal */}
      <Modal visible={showFeedback} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "#fff", width: "90%", padding: 20, borderRadius: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Feedback</Text>

            <TextInput
              placeholder="Your feedback..."
              value={feedbackText}
              onChangeText={setFeedbackText}
              style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginBottom: 10 }}
              multiline
            />

            <TextInput
              placeholder="Enter URL (optional)"
              value={feedbackUrl}
              onChangeText={setFeedbackUrl}
              style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginBottom: 10 }}
            />

            <TouchableOpacity onPress={pickFile} style={{ backgroundColor: "#2A568A", padding: 10, borderRadius: 10, marginBottom: 10 }}>
              <Text style={{ color: "#fff", textAlign: "center" }}>{selectedFile ? selectedFile.name : "Upload File"}</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity onPress={() => setShowFeedback(false)} style={{ backgroundColor: "#aaa", padding: 10, borderRadius: 10, flex: 1, marginRight: 5 }}>
                <Text style={{ color: "#fff", textAlign: "center" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmitFeedback} style={{ backgroundColor: "#4CAF50", padding: 10, borderRadius: 10, flex: 1, marginLeft: 5 }}>
                <Text style={{ color: "#fff", textAlign: "center" }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}