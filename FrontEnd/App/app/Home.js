import React, { useRef, useEffect, useState, useContext } from 'react';
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
import { UserContext } from './UserStorage/profilePic';

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
  const searchInputRef = useRef(null);
  const { focusSearch, timestamp } = useLocalSearchParams(); 
  
  // Safely access UserContext with fallback
  const contextValue = useContext(UserContext);
  const { user, saveUser } = contextValue || { user: null, saveUser: () => {} };

  // Default profile data
  const defaultProfileImage = require('../assets/images/profile.png');
  const defaultName = "Guest";

  // Check if user is logged in (has essential user data)
  const isUserLoggedIn = user && (user.email || user.id || user.username);

  // Determine profile image and name based on login status
  const getProfileImage = () => {
    if (isUserLoggedIn && user.picUrl) {
      console.log("Image Available");
      return { uri: user.picUrl };
    }else{
      console.log("Image is not available!");
    }
    return defaultProfileImage;
  };

  const getUserName = () => {
    if (isUserLoggedIn && user.name) {
      return user.name;
    }
    return defaultName;
  };

  // local state for profile image
  const [profileImage, setProfileImage] = useState(getProfileImage());
  const [showAd, setShowAd] = useState(false);
  const [adDismissed, setAdDismissed] = useState(false);

  // sync context user updates
  useEffect(() => {
    setProfileImage(getProfileImage());
  }, [user]);

  // Function to pick image - only allow if user is logged in
  const pickImage = async () => {
    // Check if user is logged in before allowing image change
    if (!isUserLoggedIn) {
      Alert.alert(
        'Login Required', 
        'Please sign up or login to change your profile picture.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

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
      setProfileImage(newImage);

      // persist in context (updates AsyncStorage)
      const updatedUser = { ...user, picUrl: newImage.uri };
      saveUser(updatedUser);
    }
  };

  // Show alert before picking - different message based on login status
  const showPickAlert = () => {
    if (!isUserLoggedIn) {
      Alert.alert(
        'Login Required',
        'Please sign up or login to customize your profile picture.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

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

  // Show premium modal after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!adDismissed) setShowAd(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [adDismissed]);

  const closeAd = () => {
    setShowAd(false);
    setAdDismissed(true); 
  };

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
          top: verticalScale(90),
          left: scale(40),
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={showPickAlert}>
          <Image
            source={profileImage}
            style={{
              width: scale(150),
              height: scale(150),
              borderRadius: scale(75),
              borderWidth: 3,
              borderColor: isUserLoggedIn ? "#fff" : "#ccc", // Different border for guest
              opacity: isUserLoggedIn ? 1 : 0.8, // Slightly transparent for guest
            }}
          />
        </TouchableOpacity>
        <View style={{ marginLeft: 20, top: -5 }}>
          <Text style={{ 
            color: isUserLoggedIn ? '#fff' : '#ddd', // Slightly dimmed for guest
            fontSize: moderateScale(30) 
          }}>
            Hello, {getUserName()}!
          </Text>
          <Text style={{ 
            top: 5, 
            color: '#ccc', 
            fontSize: moderateScale(20) 
          }}>
            {isUserLoggedIn ? 'Welcome to KHAAROT' : 'Please login to personalize'}
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