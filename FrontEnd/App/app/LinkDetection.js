import { View, Text, Image, Dimensions, TouchableOpacity, TextInput, Animated } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import inputlinks from './Input/Link_Input';
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

export default function LinkDetection() {
  const searchInputRef = useRef(null);
  const [link, setLink] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisText, setAnalysisText] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const analysisHeightAnim = useRef(new Animated.Value(0)).current;

  const handleSubmit = async () => {
    if (!link.trim()) return;
    setLoading(true);
    setResult(null);
    
    // Reset animations
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);
    
    try {
      const res = await inputlinks(link.trim());
      
      if (res) {
        // Just use the status directly
        const resultObj = {
          status: res.toLowerCase()
        };
        setResult(resultObj);
        setShowAnalysis(false); // Reset analysis state
        setAnalysisText(getAnalysisText(res.toLowerCase())); // Set analysis text based on result
        
        // Animate result appearance
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
      } else {
        setResult({
          status: 'unknown'
        });
      }
    } catch (error) {
      console.error('Error analyzing URL:', error);
      setResult({
        status: 'error'
      });
    }
    
    setLoading(false);
  };

  const getAnalysisText = (status) => {
    return "Don't Have Analyze yet";
  };

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
        return {
          color: '#00FF88',
          bgColor: 'rgba(0, 255, 136, 0.1)',
          borderColor: '#00FF88',
          icon: '✓',
          shadowColor: '#00FF88',
        };
      case 'bad':
        return {
          color: '#FF4757',
          bgColor: 'rgba(255, 71, 87, 0.1)',
          borderColor: '#FF4757',
          icon: '✗',
          shadowColor: '#FF4757',
        };
      case 'suspicious':
        return {
          color: '#FFA726',
          bgColor: 'rgba(255, 167, 38, 0.1)',
          borderColor: '#FFA726',
          icon: '⚠',
          shadowColor: '#FFA726',
        };
      case 'error':
        return {
          color: '#FF6B6B',
          bgColor: 'rgba(255, 107, 107, 0.1)',
          borderColor: '#FF6B6B',
          icon: '!',
          shadowColor: '#FF6B6B',
        };
      default:
        return {
          color: '#0BD4E6',
          bgColor: 'rgba(11, 212, 230, 0.1)',
          borderColor: '#0BD4E6',
          icon: '?',
          shadowColor: '#0BD4E6',
        };
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
          placeholder="URLs, Hashes..."
          placeholderTextColor="#ccc"
          value={link}
          onChangeText={setLink}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
        />

        <TouchableOpacity 
          onPress={handleSubmit} 
          style={{
            backgroundColor: "#0BD4E6",
            paddingVertical: 5,
            paddingHorizontal: 15,
            borderRadius: 8,
            alignItems: "center",
            right: 10,
          }}
        >
          <Text style={{ color: "#000000ff", fontSize: moderateScale(15), fontWeight: "600" }}>
            Enter
          </Text>
        </TouchableOpacity>
      </View>

      {/* Result Section */}
      <View style={{ 
        marginTop: verticalScale(60), 
        alignItems: "center", 
        width: '90%',
        minHeight: verticalScale(200),
        justifyContent: 'center' 
      }}>
        {loading && (
          <View style={{ alignItems: 'center' }}>
            <View style={{
              width: scale(60),
              height: scale(60),
              borderRadius: scale(30),
              borderWidth: 4,
              borderColor: '#0BD4E6',
              borderTopColor: 'transparent',
              marginBottom: verticalScale(20),
            }} />
            <Text style={{ 
              color: "#0BD4E6", 
              fontSize: moderateScale(22),
              fontWeight: '600'
            }}>
              Analyzing...
            </Text>
          </View>
        )}
        
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
                  {/* Status Icon */}
                  <View style={{
                    width: scale(80),
                    height: scale(80),
                    borderRadius: scale(40),
                    backgroundColor: config.color,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: verticalScale(20),
                    shadowColor: config.color,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 8,
                    elevation: 4,
                  }}>
                    <Text style={{
                      fontSize: moderateScale(35),
                      color: '#000',
                      fontWeight: 'bold',
                    }}>
                      {config.icon}
                    </Text>
                  </View>

                  {/* Status Text */}
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

                  {/* Decorative Elements */}
                  <View style={{
                    flexDirection: 'row',
                    marginTop: verticalScale(20),
                    justifyContent: 'center',
                  }}>
                    {[1, 2, 3].map((_, index) => (
                      <View
                        key={index}
                        style={{
                          width: scale(8),
                          height: scale(8),
                          borderRadius: scale(4),
                          backgroundColor: config.color,
                          marginHorizontal: scale(4),
                          opacity: 0.6,
                        }}
                      />
                    ))}
                  </View>
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
              {/* Analysis Header */}
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
              
              {/* Expandable Analysis Content */}
              <Animated.View
                style={{
                  maxHeight: analysisHeightAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1000], // Max height for expansion
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