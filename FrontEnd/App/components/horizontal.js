import React, { useRef, useState } from 'react';
import {
  View,
  Animated,
  Image,
  StyleSheet,
  Dimensions,
  PanResponder,
  Text,
} from 'react-native';

// ------------------------
// 1️⃣ Device dimensions
// ------------------------
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ------------------------
// 2️⃣ Reference design
//    Use the device you designed UI on (e.g., iPad M1)
// ------------------------
const BASE_WIDTH = 1024;    
const BASE_HEIGHT = 1366;   

// ------------------------
// 3️⃣ Scaling functions
// ------------------------
const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;              // width, horizontal spacing
const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;   // height, vertical spacing
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor; // fonts, borderRadius

export default function HorizontalScrollCards() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const leftOverscroll = useRef(new Animated.Value(0)).current;
  const rightOverscroll = useRef(new Animated.Value(0)).current;
  const tooltipOpacity = useRef(new Animated.Value(0)).current;
  const [showTooltip, setShowTooltip] = useState(false);

  // ------------------------
  // 4️⃣ Card data
  // ------------------------
  const cards = [
    { id: 1, image: require('../assets/images/image.png') },
    { id: 2, image: require('../assets/images/image.png') },
    { id: 3, image: require('../assets/images/image.png') },
    { id: 4, image: require('../assets/images/image.png') },
    { id: 5, image: require('../assets/images/image.png') },
  ];

  // ------------------------
  // 5️⃣ Scaled sizes
  // ------------------------
  const cardWidth = scale(865);        // scaled width
  const cardHeight = verticalScale(500); // scaled height
  const cardSpacing = scale(20);       // scaled spacing
  const snapDistance = cardWidth + cardSpacing;
  const totalWidth = cards.length * snapDistance;

  // ------------------------
  // 6️⃣ PanResponder for overscroll
  // ------------------------
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 5,
      onPanResponderMove: (_, gestureState) => {
        const offsetX = scrollX.__getValue();
        const maxScroll = totalWidth - snapDistance;

        // Left overscroll
        if (offsetX <= 0 && gestureState.dx > 0) {
          leftOverscroll.setValue(Math.min(gestureState.dx / 3, scale(30)));
          if (!showTooltip) {
            setShowTooltip(true);
            Animated.timing(tooltipOpacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }).start();
          }
        }

        // Right overscroll
        if (offsetX >= maxScroll && gestureState.dx < 0) {
          rightOverscroll.setValue(Math.min(Math.abs(gestureState.dx) / 3, scale(30)));
          if (!showTooltip) {
            setShowTooltip(true);
            Animated.timing(tooltipOpacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }).start();
          }
        }
      },
      onPanResponderRelease: () => {
        Animated.spring(leftOverscroll, {
          toValue: 0,
          friction: 5,
          tension: 150,
          useNativeDriver: true,
        }).start();

        Animated.spring(rightOverscroll, {
          toValue: 0,
          friction: 5,
          tension: 150,
          useNativeDriver: true,
        }).start();

        Animated.timing(tooltipOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowTooltip(false));
      },
    })
  ).current;

  // ------------------------
  // 7️⃣ Render
  // ------------------------
  return (
    <View style={styles.container}>
      <Animated.ScrollView
        {...panResponder.panHandlers}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapDistance}
        decelerationRate="fast"
        bounces={false}
        contentContainerStyle={{ paddingHorizontal: scale(75) }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {cards.map((item, index) => {
          const inputRange = [
            (index - 1) * snapDistance,
            index * snapDistance,
            (index + 1) * snapDistance,
          ];

          const scaleAnim = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 1, 0.7],
            extrapolate: 'clamp',
          });

          const isFirstCard = index === 0;
          const isLastCard = index === cards.length - 1;

          // Overscroll scale effect
          const overscrollScale = (isFirstCard
            ? leftOverscroll
            : isLastCard
            ? rightOverscroll
            : new Animated.Value(0)
          ).interpolate({
            inputRange: [0, scale(30)],
            outputRange: [1, 0.95],
            extrapolate: 'clamp',
          });

          const translateX = isFirstCard
            ? leftOverscroll
            : isLastCard
            ? rightOverscroll
            : 0;

          return (
            <Animated.View
              key={item.id}
              style={[
                styles.card,
                {
                  width: cardWidth,       // scaled
                  height: cardHeight,     // scaled
                  transform: [{ scale: Animated.multiply(scaleAnim, overscrollScale) }, { translateX }],
                  opacity,
                  marginRight: cardSpacing,
                  borderRadius: moderateScale(25), // scaled
                },
              ]}
            >
              <Image
                source={item.image}
                style={{ width: '100%', height: '100%', borderRadius: moderateScale(25) }}
                resizeMode="cover"
              />

              {/* Glow overlay */}
              {(isFirstCard || isLastCard) && (
                <Animated.View
                  pointerEvents="none"
                  style={[
                    StyleSheet.absoluteFillObject,
                    {
                      // backgroundColor: 'rgba(223, 111, 111, 0.6)',
                      borderRadius: moderateScale(25),
                      opacity: (isFirstCard ? leftOverscroll : rightOverscroll).interpolate({
                        inputRange: [0, scale(30)],
                        outputRange: [0, 0.4],
                        extrapolate: 'clamp',
                      }),
                    },
                  ]}
                />
              )}
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      {/* Tooltip
      {showTooltip && (
        <Animated.View style={[styles.tooltip, { opacity: tooltipOpacity }]}>
          <Text style={[styles.tooltipText, { fontSize: moderateScale(14) }]}>no more slides</Text>
        </Animated.View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: verticalScale(20),
  },
  tooltip: {
    position: 'absolute',
    bottom: verticalScale(20),
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(15),
  },
  tooltipText: {
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
});
