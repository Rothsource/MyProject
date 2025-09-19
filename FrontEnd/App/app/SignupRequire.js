// utils/accountAlert.js
import { Alert } from "react-native";
import { router } from "expo-router";

/**
 * Show account alert with Login, Signup, and Cancel options
 * Simple reusable function that can be used anywhere in the app
 */
export const showAccountAlert = () => {
  Alert.alert(
    "Account",
    "Choose an option",
    [
      { 
        text: "Login", 
        onPress: () => router.push("/Login") 
      },
      { 
        text: "Signup", 
        onPress: () => router.push("/Signup") 
      },
      { 
        text: "Cancel", 
        style: "cancel" 
      },
    ],
    { cancelable: true }
  );
};

// Alternative version if you want to customize the routes
export const showAccountAlertCustom = (loginRoute = "/Login", signupRoute = "/Signup") => {
  Alert.alert(
    "Account",
    "Choose an option",
    [
      { 
        text: "Login", 
        onPress: () => router.push(loginRoute) 
      },
      { 
        text: "Signup", 
        onPress: () => router.push(signupRoute) 
      },
      { 
        text: "Cancel", 
        style: "cancel" 
      },
    ],
    { cancelable: true }
  );
};