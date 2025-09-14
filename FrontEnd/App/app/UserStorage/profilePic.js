import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doSignup } from "../Account/Signup";

// Create Context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const json = await AsyncStorage.getItem("user");
        if (json) setUser(JSON.parse(json));
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };
    loadUser();
  }, []);

  const saveUser = async (userData) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

  const signupUser = async (phone, password, username, profileImageData = null) => {
    const result = await doSignup(phone, password, username, profileImageData);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const userData = { name: result.name, picUrl: result.picUrl };
    await saveUser(userData);

    return { success: true, user: userData };
  };

  return (
    <UserContext.Provider value={{ user, saveUser, signupUser }}>
      {children}
    </UserContext.Provider>
  );
};
