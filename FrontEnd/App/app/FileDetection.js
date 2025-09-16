import { View, Text, Image, Dimensions, TouchableOpacity, TextInput, Alert, Animated } from 'react-native';
import { useRef, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import inputhash from './Input/Hash_Input';
import hashFile from './HashFile/hash_al';
import { router } from 'expo-router';

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
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisText, setAnalysisText] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const analysisHeightAnim = useRef(new Animated.Value(0)).current;

  // Handle file selection
  const handleFileSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ 
        type: "*/*",
        copyToCacheDirectory: true
      });
      
      if (result.canceled || result.type === "cancel") {
        return;
      }

      const file = Array.isArray(result.assets) ? result.assets[0] : result;

      if (file.size && file.size > 100 * 1024 * 1024) {
        Alert.alert("Error", "File too large. Please select a smaller file.");
        return;
      }

      setSelectedFile(file);
      setInputValue(file.name);
    } catch (err) {
      console.error("Error selecting file:", err);
      Alert.alert("Error", "Failed to select file");
    }
  };

  // Handle the main processing
  const handleProcess = async () => {
    if (!inputValue.trim()) {
      Alert.alert("Error", "Please enter a hash or select a file first.");
      return;
    }

    setIsProcessing(true);
    setResult(null);

    // reset animations
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);

    try {
      if (selectedFile) {
        await processFile();
      } else {
        await processHash();
      }

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (err) {
      console.error("Error during processing:", err);
      setResult({ status: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  const processFile = async () => {
    try {
      const hashes = await hashFile(selectedFile.uri);

      let detectionResult = null;
      for (const key of ["md5", "sha1", "sha256"]) {
        const hashValue = hashes[key];
        try {
          detectionResult = await inputhash(hashValue);
          if (detectionResult?.label) break;
        } catch (err) {
          console.log(`Hash ${key} not found:`, err);
        }
      }

      if (detectionResult?.label) {
        setResult({ status: detectionResult.label.toLowerCase() });
        setAnalysisText("Analysis info for file...");
      } else {
        setResult({ status: "unknown" });
        setAnalysisText("File not found in database.");
      }
    } catch (err) {
      console.error("Error processing file:", err);
      setResult({ status: "error" });
    }
  };

  const processHash = async () => {
    try {
      const res = await inputhash(inputValue.trim());
      if (res?.label) {
        setResult({ status: res.label.toLowerCase() });
        setAnalysisText("Analysis info for hash...");
      } else {
        setResult({ status: "unknown" });
        setAnalysisText("Hash not found in database.");
      }
    } catch (err) {
      console.error("Error detecting hash:", err);
      setResult({ status: "error" });
    }
  };

  const handleInputChange = (text) => {
    setInputValue(text);
    if (selectedFile) {
      setSelectedFile(null);
    }
  };

  const hasInput = inputValue.length > 0;

  const toggleAnalysis = () => {
    setShowAnalysis(!showAnalysis);
    Animated.timing(analysisHeightAnim, {
      toValue: showAnalysis ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const getResultConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'good':
        return { color: '#00FF88', bgColor: 'rgba(0, 255, 136, 0.1)', borderColor: '#00FF88', icon: '✓', shadowColor: '#00FF88' };
      case 'bad':
        return { color: '#FF4757', bgColor: 'rgba(255, 71, 87, 0.1)', borderColor: '#FF4757', icon: '✗', shadowColor: '#FF4757' };
      case 'suspicious':
        return { color: '#FFA726', bgColor: 'rgba(255, 167, 38, 0.1)', borderColor: '#FFA726', icon: '⚠', shadowColor: '#FFA726' };
      case 'error':
        return { color: '#FF6B6B', bgColor: 'rgba(255, 107, 107, 0.1)', borderColor: '#FF6B6B', icon: '!', shadowColor: '#FF6B6B' };
      default:
        return { color: '#0BD4E6', bgColor: 'rgba(11, 212, 230, 0.1)', borderColor: '#0BD4E6', icon: '?', shadowColor: '#0BD4E6' };
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#1E4368',
        alignItems: 'center',
        paddingTop: verticalScale(150),
      }}
    >
      <View 
        style={{
          position: "absolute",
          top: 95,
          left: 25, 
          zIndex: 6,
        }}
      >
        <TouchableOpacity onPress={() => router.push('./Home')}>
          <Image 
            source={require('../assets/images/back.png')}
            style={{
              width: scale(100), 
              height: verticalScale(30), 
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      </View>

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

      {/* Search Bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: verticalScale(50),
          width: '90%',
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
        <TextInput
          ref={searchInputRef}
          style={{
            flex: 1,
            height: verticalScale(80),
            color: '#fff',
            fontSize: moderateScale(20),
          }}
          placeholder="Enter Hash or Select File..."
          placeholderTextColor="#ccc"
          value={inputValue}
          onChangeText={handleInputChange}
          onSubmitEditing={handleProcess}
          returnKeyType="search"
          editable={!isProcessing}
        />

        <TouchableOpacity 
          onPress={hasInput ? handleProcess : handleFileSelection}
          disabled={isProcessing || (hasInput && !inputValue.trim())}
          style={{
            backgroundColor: "#0BD4E6",
            paddingVertical: 7,
            paddingHorizontal: 17,
            borderRadius: 8,
            alignItems: "center",
            right: 10,
            opacity: (isProcessing || (hasInput && !inputValue.trim())) ? 0.6 : 1,
          }}
        >
          <Text 
            style={{
              color: "#000000ff",
              fontSize: scale(20),
              fontWeight: "600",
            }}
          >
            {isProcessing ? 'Processing...' : (hasInput ? 'Enter' : 'Upload')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* File indicator */}
      {selectedFile && (
        <View style={{ marginTop: verticalScale(10), alignItems: 'center' }}>
          <Text style={{ color: '#0BD4E6', fontSize: moderateScale(16) }}>
            File selected: {selectedFile.name}
          </Text>
        </View>
      )}

      {/* Result Section */}
      <View style={{ 
        marginTop: verticalScale(60), 
        alignItems: "center", 
        width: '90%',
        minHeight: verticalScale(200),
        justifyContent: 'center' 
      }}>
        {result && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              width: '100%',
              alignItems: 'center',
            }}
          >
            {(() => {
              const config = getResultConfig(result.status);
              return (
                <View style={{
                  backgroundColor: config.bgColor,
                  borderWidth: 2,
                  borderColor: config.borderColor,
                  borderRadius: moderateScale(20),
                  padding: scale(30),
                  width: '90%',
                  alignItems: 'center',
                  shadowColor: config.shadowColor,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 8,
                }}>
                  <View style={{
                    width: scale(80),
                    height: scale(80),
                    borderRadius: scale(40),
                    backgroundColor: config.color,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: verticalScale(20),
                  }}>
                    <Text style={{
                      fontSize: moderateScale(35),
                      color: '#000',
                      fontWeight: 'bold',
                    }}>
                      {config.icon}
                    </Text>
                  </View>
                  <Text style={{
                    color: config.color,
                    fontSize: moderateScale(32),
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    textAlign: 'center',
                  }}>
                    {result.status}
                  </Text>
                </View>
              );
            })()}

            {/* Analysis Box */}
            <TouchableOpacity
              onPress={toggleAnalysis}
              style={{
                marginTop: verticalScale(50),
                width: '90%',
                backgroundColor: 'rgba(42, 86, 138, 0.8)',
                borderRadius: moderateScale(15),
                borderWidth: 1,
                borderColor: '#0BD4E6',
                overflow: 'hidden',
              }}
            >
              <View style={{
                padding: scale(20),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Text style={{
                  color: '#0BD4E6',
                  fontSize: moderateScale(25),
                  fontWeight: '600',
                }}>
                  Detailed Analysis
                </Text>
                <Text style={{
                  color: '#0BD4E6',
                  fontSize: moderateScale(25),
                  transform: [{ rotate: showAnalysis ? '180deg' : '0deg' }],
                }}>
                  ▼
                </Text>
              </View>
              <Animated.View
                style={{
                  maxHeight: analysisHeightAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1000],
                  }),
                  opacity: analysisHeightAnim,
                }}
              >
                <View style={{
                  paddingHorizontal: scale(20),
                  paddingBottom: scale(20),
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(11, 212, 230, 0.3)',
                }}>
                  <Text style={{
                    marginTop: 20,
                    color: '#fff',
                    fontSize: moderateScale(20),
                    lineHeight: moderateScale(20),
                    fontFamily: 'monospace',
                  }}>
                    {analysisText}
                  </Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
