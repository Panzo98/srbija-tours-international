import { TouchableOpacity, Text } from "react-native";
import React from "react";

export default function ConfirmModalButton({ handleConfirm }) {
  return (
    <TouchableOpacity
      onPress={handleConfirm}
      style={
        {
          // backgroundColor: "#e1e1e1",
          // height: 30,
          // paddingHorizontal: 10,
          // justifyContent: "center",
          // alignItems: "center",
        }
      }
    >
      <Text style={{ fontSize: 20 }}>Potvrdi izbor</Text>
    </TouchableOpacity>
  );
}
