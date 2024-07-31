import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const BusLoader = () => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    console.log("BusLoader mounted");

    const animate = () => {
      console.log("Starting animation");
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.4,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    animate();
  }, [scaleValue]);

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[styles.loaderContainer, { transform: [{ scale: scaleValue }] }]}
      >
        <Animated.View
          style={[styles.iconContainer, { transform: [{ scale: scaleValue }] }]}
        >
          <Fontisto
            name="bus"
            size={screenHeight * 0.06}
            color="#188DFD"
            style={{ zIndex: 1000 }}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    elevation: Platform.OS === "android" ? 5 : 0,
  },
  loadingText: {
    color: "white",
    fontSize: screenHeight * 0.03,
    marginBottom: 20,
  },
  iconContainer: {
    width: screenHeight * 0.06,
    height: screenHeight * 0.06,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    backgroundColor: "white",
    padding: screenWidth * 0.09,
    borderRadius: 9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default BusLoader;
