import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ModalHeader({ modalName, slideDown }) {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.modalName}>{modalName}</Text>
      <TouchableOpacity style={styles.closeButton} onPress={slideDown}>
        <AntDesign name="close" size={screenHeight * 0.025} color="#757575" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "96%",
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: screenHeight * 0.015,
  },
  modalName: {
    fontSize: screenHeight * 0.04,
    fontWeight: "bold",
  },
  closeButton: {
    height: screenHeight * 0.04,
    width: screenHeight * 0.04,
    borderRadius: screenHeight * 0.02,
    backgroundColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
  },
});
