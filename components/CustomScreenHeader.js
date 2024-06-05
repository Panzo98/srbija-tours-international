import { View, Image, StyleSheet, Text, Dimensions } from "react-native";
import React from "react";
import { useAssets } from "expo-asset";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function CustomScreenHeader({ title }) {
  const [assets] = useAssets([
    require("../assets/images/company-logo-white.png"),
  ]);

  if (!assets)
    return (
      <View>
        <Text>Učitavanje</Text>
      </View>
    );
  return (
    <View>
      <View style={styles.header}>
        <Image source={assets[0]} style={styles.image} />
      </View>
      <View style={styles.miniBanner}>
        <Text style={styles.miniBannerTxt}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#188DFD",
    height: screenHeight * 0.12,
  },
  image: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.05,
    resizeMode: "contain",
  },
  miniBannerTxt: {
    color: "white",
    fontSize: screenHeight * 0.025,
    fontWeight: "bold",
    paddingVertical: screenHeight * 0.005,
  },
  miniBanner: {
    width: "100%",
    backgroundColor: "#005B85",
    justifyContent: "center",
    alignItems: "center",
  },
});
