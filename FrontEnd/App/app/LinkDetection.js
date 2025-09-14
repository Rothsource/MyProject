import { View, Text, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { useRef } from 'react';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Reference design: iPad M1
const BASE_WIDTH = 1024;
const BASE_HEIGHT = 1366;

// Scaling helpers
const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export default function LinkDetection() {
  const searchInputRef = useRef(null);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#1E4368',
        alignItems: 'center',
        paddingTop: verticalScale(80), // move everything closer to top
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
            marginBottom: verticalScale(-40), // slight overlap
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

      {/* Search Bar */}
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
        <TouchableOpacity onPress={() => searchInputRef.current?.focus()}>
          {/* <Image
            source={require('../assets/images/search.png')}
            style={{
              width: scale(30),
              height: scale(30),
              tintColor: '#0BD4E6',
              marginRight: scale(15),
            }}
          /> */}
        </TouchableOpacity>

        <TextInput
          ref={searchInputRef}
          style={{
            flex: 1,
            height: verticalScale(80),
            color: '#fff',
            fontSize: moderateScale(20),          
          }}
          placeholder="URLs, Hashs..."
          placeholderTextColor="#ccc"
        />
      </View>
    </View>
  );
}
