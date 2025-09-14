import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Reference design: iPad M1
const BASE_WIDTH = 1024;
const BASE_HEIGHT = 1366;

// Scaling helpers
const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export default function AutoDetection() {
  const searchInputRef = useRef(null);

  // Labels stored in variables
  const BOX_LABELS = ["Detect Links", "Detect Files", "Detect Network"];

  // Toggle states
  const [activeStates, setActiveStates] = useState([false, false, false]);

  const handleToggle = (index) => {
    const updated = [...activeStates];
    updated[index] = !updated[index];
    setActiveStates(updated);
  };

  const renderToggleBox = (label, index) => {
    const isActive = activeStates[index];
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          marginBottom: verticalScale(25),
        }}
        key={index}
      >
        <TouchableOpacity
          onPress={() => handleToggle(index)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{
            backgroundColor: isActive ? '#0BD4E6' : '#2A568A',
            borderRadius: moderateScale(35),
            paddingVertical: verticalScale(40), // Bigger box
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 8,
            borderWidth: 2,
            borderColor: isActive ? '#00E5FF' : '#1E4368',
          }}
          activeOpacity={0.9}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: moderateScale(34), // Bigger text
              fontWeight: '800',
              letterSpacing: 1,
            }}
          >
            {label}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#1E4368',
        alignItems: 'center',
        paddingTop: verticalScale(80),
      }}
    >
      {/* Logo + Text */}
      <View style={{ alignItems: 'center' }}>
        <Image
          source={require('../assets/images/logo.png')}
          style={{
            width: scale(350),
            height: verticalScale(250),
            resizeMode: 'contain',
            marginBottom: verticalScale(-40),
          }}
        />
        <Text
          style={{
            color: '#0BD4E6',
            fontSize: moderateScale(65),
            fontFamily: 'Inter',
            fontWeight: '700',
            textAlign: 'center',
          }}
        >
          I'm KHAAROT
        </Text>
      </View>

      {/* Toggle Boxes */}
      <View
        style={{
          marginTop: verticalScale(80),
          width: '85%',
        }}
      >
        {BOX_LABELS.map((label, index) => renderToggleBox(label, index))}
      </View>
    </View>
  );
}
