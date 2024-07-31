import { TouchableOpacity, Text } from "react-native";
import React from "react";

export default function ConfirmModalButton({ handleConfirm }) {
  return (
    <TouchableOpacity
      onPress={handleConfirm}
      style={{
        backgroundColor: "#188DFD",
        // backgroundColor: "#e1e1e1",
        borderRadius: 5,
        height: 40,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 20, color: "white" }}>Potvrdi izbor</Text>
    </TouchableOpacity>
  );
}
