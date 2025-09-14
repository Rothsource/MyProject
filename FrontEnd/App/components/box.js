import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Reference design: the device you designed UI on
const BASE_WIDTH = 1024;    // iPad M1 width
const BASE_HEIGHT = 1366;   // iPad M1 height

// Scaling functions
const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;           // horizontal: width, left/right
const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size; // vertical: height, top/bottom
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor; // font, borderRadius, small paddings

export default function RoundedBlueBox({ 
  text = "Link", 
  textSize = 24, 
  icon, 
  targetScreen 
}) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.roundedBox}
      onPress={() => targetScreen && navigation.navigate(targetScreen)}
      activeOpacity={0.8}
    >
      {icon && (
        <Image
          source={icon}
          style={styles.icon}
        />
      )}
      <Text style={[styles.linkText, { fontSize: moderateScale(textSize) }]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  roundedBox: {
    width: scale(180),               // scaled width
    height: verticalScale(120),      // scaled height
    backgroundColor: '#1E4368',
    borderRadius: moderateScale(20), // scaled border radius
    borderWidth: scale(2),           // scaled border
    borderColor: '#000',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: verticalScale(10), // scaled padding
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(6) },
    shadowOpacity: 0.25,
    shadowRadius: scale(10),
    // Elevation for Android
    elevation: 10,
  },
  linkText: {
    color: '#fff',
    fontWeight: '300',
    letterSpacing: scale(1),           // scaled letter spacing
    marginTop: verticalScale(5),       // scaled spacing
    textAlign: 'center',
  },
  icon: {
    width: scale(50),                  // scaled icon width
    height: verticalScale(50),         // scaled icon height
    marginBottom: verticalScale(8),   // scaled spacing below icon
    resizeMode: 'contain',             // important: full icon visible
  },
});
