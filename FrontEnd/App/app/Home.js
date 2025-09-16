import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import '../../App/global.css';
import RoundedBlueBox from '../components/box';
import HorizontalScrollCards from '../components/horizontal';
import AutoDetection from './AutoDetection';
import FileDetection from './FileDetection';
import LinkDetection from './LinkDetection';
import PremiumPlans from './Advertise';
import { usersInfo } from './userInfo';

// Screen dimensions for scaling
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 1024;    // iPad M1 width
const BASE_HEIGHT = 1366;   // iPad M1 height

// Scaling functions
const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export default function Home() {
  const [user, setUser] = useState({
    name: "",
    phone_number: "",
    pic_url: "",
  });

  const [profileImage, setProfileImage] = useState(null);

  // Premium modal state
  const [showAd, setShowAd] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const adTimerRef = useRef(null);

  const searchInputRef = useRef(null);
  const { focusSearch, timestamp } = useLocalSearchParams();

  // Load user info
  async function loadUser() {
    const userData = await usersInfo();
    setUser(userData);
    setProfileImage(userData.pic_url);
  }

  useEffect(() => {
    loadUser();
  }, []);

  // Show alert before picking image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need access to your gallery to change the profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = { uri: result.assets[0].uri };
      setProfileImage(newImage.uri);
    }
  };

  const showPickAlert = () => {
    Alert.alert(
      'Change Profile Picture',
      'Do you want to choose a new profile picture?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Choose Image', onPress: pickImage },
      ],
      { cancelable: true }
    );
  };

  // Autofocus search
  useEffect(() => {
    if (focusSearch === "true") {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  }, [focusSearch, timestamp]);

  // Function to close ad
  const closeAd = () => {
    setShowAd(false);
  };

  // Schedule ad popup
  const scheduleAd = (delayMs) => {
    if (adTimerRef.current) clearTimeout(adTimerRef.current);

    adTimerRef.current = setTimeout(() => {
      setShowAd(true);
    }, delayMs);
  };

  // Run popup logic
  useEffect(() => {
    if (firstTime) {
      scheduleAd(5000); // 5 seconds first time
      setFirstTime(false);
    } else {
      scheduleAd(2 * 60 * 1000); // 2 minutes next visits
    }

    return () => {
      if (adTimerRef.current) clearTimeout(adTimerRef.current);
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#1E4368' }}>
      <StatusBar hidden={true} />

      {/* PremiumPlans Modal */}
      <Modal visible={showAd} animationType="fade" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 20,
              width: '90%',
              padding: 20,
            }}
          >
            <TouchableOpacity
              onPress={closeAd}
              style={{ position: 'absolute', top: 10, right: 10 }}
            >
              <Text style={{ fontSize: 24, color: '#1E4368' }}>✕</Text>
            </TouchableOpacity>
            <PremiumPlans />
          </View>
        </View>
      </Modal>

      {/* Profile Section */}
      <View
        style={{
          position: 'absolute',
          top: verticalScale(110),
          left: scale(40),
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={showPickAlert}>
          <Image
            source={{ uri: profileImage }}
            style={{
              width: scale(150),
              height: scale(150),
              borderRadius: scale(75),
              borderWidth: 3,
              borderColor: "#fff",
            }}
          />
        </TouchableOpacity>
        <View style={{ marginLeft: 15, top: -3 }}>
          <Text style={{ color: '#fff', fontSize: moderateScale(25) }}>
            Hello, {user.name}!
          </Text>
          <Text style={{ top: 5, color: '#ccc', fontSize: moderateScale(15) }}>
            Welcome to KHAAROT
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: scale(40),
          marginTop: verticalScale(280),
          backgroundColor: '#1E4368',
          borderRadius: moderateScale(40),
          borderWidth: 1,
          paddingHorizontal: verticalScale(30),
          paddingVertical: scale(10),
        }}
      >
        <TouchableOpacity onPress={() => searchInputRef.current?.focus()}>
          <Image
            source={require('../assets/images/search.png')}
            style={{
              width: scale(30),
              height: scale(30),
              marginRight: scale(20),
            }}
          />
        </TouchableOpacity>

        <TextInput
          ref={searchInputRef}
          style={{
            flex: 1,
            height: verticalScale(80),
            color: '#fff',
            fontSize: moderateScale(20),
          }}
          placeholder="URLs, Hashes..."
          placeholderTextColor="#ccc"
        />
      </View>

      {/* Scan For Detection */}
      <View style={{ top: verticalScale(20), left: scale(50) }}>
        <Text style={{ top: verticalScale(10), color: '#ccc', fontSize: moderateScale(20) }}>
          Scan For Detection
        </Text>
      </View>

      <View style={{ position: 'absolute', top: verticalScale(490), left: scale(100) }}>
        <RoundedBlueBox
          text="Links"
          textSize={moderateScale(20)}
          icon={require('../assets/images/link.png')}
          targetScreen={LinkDetection}
        />
      </View>
      <View style={{ position: 'absolute', top: verticalScale(490), right: scale(425) }}>
        <RoundedBlueBox
          text="Files"
          textSize={moderateScale(20)}
          icon={require('../assets/images/file.png')}
          targetScreen={FileDetection}
        />
      </View>
      <View style={{ position: 'absolute', top: verticalScale(490), right: scale(100) }}>
        <RoundedBlueBox
          text="Auto"
          textSize={moderateScale(20)}
          icon={require('../assets/images/auto.png')}
          targetScreen={AutoDetection}
        />
      </View>

      {/* Information Section */}
      <View style={{ top: verticalScale(230), left: scale(50) }}>
        <Text style={{ top: 10, color: '#ccc', fontSize: moderateScale(20) }}>
          Information
        </Text>
      </View>

      <View style={{ top: verticalScale(270) }}>
        <HorizontalScrollCards />
      </View>
    </View>
  );
}
