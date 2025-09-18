// LoginAlert.js
import { Alert } from "react-native";
import { router } from "expo-router";
import { getAccessToken } from "../TokensStorage/storeTokens"; 

export async function requireAuth(action) {
  const token = await getAccessToken();

  if (!token) {
    Alert.alert(
      "Login Required",
      "You must log in or sign up to continue.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => router.push("/login") },
        { text: "Sign Up", onPress: () => router.push("/signup") }
      ]
    );
    return;
  }
  if (typeof action === "function") {
    action();
  }
}
