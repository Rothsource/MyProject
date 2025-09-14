import React from "react";
import { Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";


//Device dimensions

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

//Reference design

const BASE_WIDTH = 1024;    //iPad M1 width
const BASE_HEIGHT = 1366;   //iPad M1 height

const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size; //adjust, width, left/right, horizontal position, 
const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size; //adjust, height, verticle position, top/bottom, magin paddings
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor; //fonts, borderRadius, small paddings

const IconWithLabel = ({
  source,
  label,
  size = 90,          
  isCircle = false,
  onPress,
  color = "#fff",
  top,
  right,
  bottom,
  left,
}) => {

  const positionStyle =
    top !== undefined || right !== undefined || bottom !== undefined || left !== undefined
      ? {
          position: "absolute",
          top: top !== undefined ? verticalScale(top) : undefined,
          right: right !== undefined ? scale(right) : undefined,
          bottom: bottom !== undefined ? verticalScale(bottom) : undefined,
          left: left !== undefined ? scale(left) : undefined,
        }
      : {};

  const ICON_WIDTH = scale(size+10);
  const ICON_HEIGHT = verticalScale(size);
  const CONTAINER_HEIGHT = ICON_HEIGHT + verticalScale(25); 

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, positionStyle, { minHeight: CONTAINER_HEIGHT }]}
    >
      <Image
        source={source}
        style={{
          width: ICON_WIDTH,
          height: ICON_HEIGHT,
          borderRadius: isCircle ? ICON_WIDTH / 2 : 0, 
          tintColor: color,
          resizeMode: "contain", 
        }}
      />
      {label && (
        <Text style={[styles.label, { color, marginTop: verticalScale(5), fontSize: moderateScale(14) }]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center", 
    justifyContent: "flex-start",
  },
  label: {
    textAlign: "center",
  },
});

export default IconWithLabel;
