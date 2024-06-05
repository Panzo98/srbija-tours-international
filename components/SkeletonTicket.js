import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const SkeletonTicket = () => {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.qrContainer}>
          <LinearGradient
            colors={["#e0e0e0", "#c0c0c0", "#e0e0e0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </View>
        <View style={styles.detailsContainer}>
          <LinearGradient
            colors={["#e0e0e0", "#c0c0c0", "#e0e0e0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradient, styles.name]}
          />
          <LinearGradient
            colors={["#e0e0e0", "#c0c0c0", "#e0e0e0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradient, styles.otherText]}
          />
          <LinearGradient
            colors={["#e0e0e0", "#c0c0c0", "#e0e0e0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradient, styles.otherText]}
          />
          <LinearGradient
            colors={["#e0e0e0", "#c0c0c0", "#e0e0e0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradient, styles.price]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    // padding: screenWidth * 0.02,
  },
  container: {
    backgroundColor: "white",
    width: "100%",
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5.46,
    elevation: 9,
    marginBottom: 15,
    padding: 10,
  },
  qrContainer: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    marginLeft: 10,
    flex: 1,
  },
  gradient: {
    height: 20,
    borderRadius: 10,
    marginVertical: 5,
  },
  name: {
    width: "60%",
  },
  otherText: {
    width: "40%",
  },
  price: {
    width: "30%",
  },
});

export default SkeletonTicket;
