import { View, Text, Image, Dimensions, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRef } from 'react';
import * as DocumentPicker from 'expo-document-picker';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Reference design: iPad M1
const BASE_WIDTH = 1024;
const BASE_HEIGHT = 1366;

// Scaling helpers
const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export default function FileDetection() {
  const searchInputRef = useRef(null);

  // Function to pick and upload file
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // allow all file types
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        Alert.alert("File Selected", `You selected: ${result.name}`);
        console.log("Selected file:", result);
        // 🔥 Here you can upload `result.uri` to your server
      } else {
        console.log("File picking cancelled");
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Something went wrong while picking the file.");
    }
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

      {/* Search Bar with File Icon */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: verticalScale(50),
          width: '80%',
          backgroundColor: '#2A568A',
          borderRadius: moderateScale(50),
          paddingHorizontal: scale(30),
          paddingVertical: verticalScale(1),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          borderWidth: 1,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        {/* Text Input */}
        <TextInput
          ref={searchInputRef}
          style={{
            flex: 1,
            height: verticalScale(80),
            color: '#fff',
            fontSize: moderateScale(20),
          }}
          placeholder="Enter Hash..."
          placeholderTextColor="#ccc"
        />

        {/* File Icon */}
        <TouchableOpacity onPress={pickFile}>
          <Image
            source={require('../assets/images/upload.png')}
            style={{
              width: scale(40),
              height: scale(40),
              left: scale(-10),
              tintColor: '#cac6c6ff',
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
