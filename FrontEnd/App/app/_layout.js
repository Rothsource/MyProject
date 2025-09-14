import { Stack, usePathname, router, inactiveColor, activeColor } from "expo-router";
import { View } from "react-native";
import React, { useState } from "react";
import IconWithLabel from "../components/TabPosition";
import Menu from "./Menu";

export default function Layout() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleDrawer = () => setIsMenuOpen(!isMenuOpen);

  return (
    <View style={{ flex: 1, backgroundColor: "#1E4368" }}>
      {/* Render screens via Expo Router */}
      <Stack screenOptions={{ headerShown: false }} />

      {/* Bottom navigation */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: "#1E4368",
          paddingVertical: 30,
          zIndex: 3,
        }}
      >
        {/* Home */}
        <IconWithLabel
          source={require("../assets/images/home.png")}
          label="Home"
          size={35}
          color={pathname === "/Home" ? "#4da6ff" : "#fff"}
          onPress={() => router.push("/Home")}
        />

        {/* 🔥 Search */}
        <IconWithLabel
          source={require("../assets/images/search.png")}
          label="Search"
          size={35}
          color={
            pathname === "/Home"
              ? activeColor
              : inactiveColor
          }
          onPress={() => {
            if (pathname === "/Home") {
              // 🔥 Already on Home: Force focus by updating params with timestamp
              router.setParams({ 
                focusSearch: "true",
                timestamp: Date.now().toString() // Force re-trigger
              }); 
            } else {
              // Navigate to Home with focus
              router.push({
                pathname: "/Home",
                params: { focusSearch: "true" },
              });
            }
          }}
        />

        {/* Videos */}
        <IconWithLabel
          source={require("../assets/images/play.png")}
          label="Videos"
          size={35}
          color={pathname === "/Play" ? "#4da6ff" : "#fff"}
          onPress={() => router.push("/Play")}
        />

        {/* Notifications */}
        <IconWithLabel
          source={require("../assets/images/notification.png")}
          label="Notification"
          size={35}
          color={pathname === "/Notification" ? "#4da6ff" : "#fff"}
          onPress={() => router.push("/Notification")}
        />
      </View>

      {/* Menu button */}
      <View style={{ position: "absolute", top: 100, right: 40, zIndex: 6 }}>
        <IconWithLabel
          source={require("../assets/images/menu.png")}
          size={45}
          onPress={toggleDrawer}
        />
      </View>

      {/* Drawer */}
      <Menu isOpen={isMenuOpen} toggleDrawer={toggleDrawer} />
    </View>
  );
}
