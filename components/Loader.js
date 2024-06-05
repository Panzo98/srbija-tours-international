import { ActivityIndicator, View } from "react-native";
import React from "react";
import CustomScreenHeader from "./CustomScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Loader() {
  return (
    <ActivityIndicator
      size="large"
      color="#188dfd"
      style={{ flex: 1, alignItems: "center" }}
    />
  );
}
