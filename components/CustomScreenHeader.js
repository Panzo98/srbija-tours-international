import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useAssets } from "expo-asset";
import { AntDesign } from "@expo/vector-icons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function CustomScreenHeader({ title, navigation }) {
  const [assets] = useAssets([
    require("../assets/images/company-logo-white.png"),
  ]);

  if (!assets)
    return (
      <View style={styles.loadingContainer}>
        <Text>Učitavanje</Text>
      </View>
    );

  const showBackButton =
    title !== "Porudžbina" &&
    title !== "Opšti uslovi prevoza" &&
    title !== "Pregled narudžbi";

  return (
    <View>
      <View style={styles.header}>
        {showBackButton && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <AntDesign name="arrowleft" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <Image source={assets[0]} style={styles.image} />
      </View>
      <View style={styles.miniBanner}>
        <Text style={styles.miniBannerTxt}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#188DFD",
    height: screenHeight * 0.11,
    flexDirection: "row",
  },
  backButton: {
    position: "absolute",
    left: screenWidth * 0.02,
    top: screenHeight * 0.04,
  },
  image: {
    width: screenWidth * 0.6,
    height: screenHeight * 0.05,
    resizeMode: "contain",
    position: "absolute",
    top: screenHeight * 0.04,
  },
  miniBanner: {
    width: "100%",
    backgroundColor: "#005B85",
    justifyContent: "center",
    alignItems: "center",
  },
  miniBannerTxt: {
    color: "white",
    fontSize: screenHeight * 0.021,
    fontWeight: "bold",
    paddingVertical: screenHeight * 0.005,
  },
});
