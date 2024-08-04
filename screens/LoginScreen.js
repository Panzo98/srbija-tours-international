import React, { useState } from "react";
import axios from "../utils/axiosConfig";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { useAssets } from "expo-asset";
import { Feather } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const saveData = async (key, value) => {
  const isAvailable = await SecureStore.isAvailableAsync();
  if (!isAvailable) {
    Alert.alert("SecureStore is not available on this device", "test");
    return;
  }

  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    Alert.alert("Failed to save data", error);
  }
};

const LoginScreen = ({ navigation }) => {
  const companyLogo = require("../assets/images/company-logo-white.png");
  const tempCompanyLogo =
    "data:image/png;base64,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";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const handleLogin = async () => {
    let response;
    try {
      dispatch({ type: "SET_LOADING" });
      response = await axios.post(
        "/login_passenger",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { access_token, user, message } = response.data;

      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      dispatch({ type: "DISABLE_LOADING" });
      saveData("token", access_token);
      saveData("user", JSON.stringify(user));
      Alert.alert("Login Status", "Uspješno prijavljen");
    } catch (error) {
      dispatch({ type: "DISABLE_LOADING" });
      Alert.alert("Login Status", "Netačni podaci!");
    }
  };

  const handleGoToRegister = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Register" }],
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      // StatusBar.setBackgroundColor("#188DFD");
    }, [])
  );
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ExpoStatusBar backgroundColor="#188dfd" style="light" />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always"
      >
        <Image
          source={companyLogo}
          defaultSource={{ uri: tempCompanyLogo }}
          style={styles.image}
        />
        <View style={styles.inputContainer}>
          <Feather name="user" size={24} color="white" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="E-Mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholderTextColor="white"
          />
        </View>
        <View style={styles.inputContainer}>
          <Feather name="lock" size={24} color="white" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Lozinka"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="white"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>Prijavi se</Text>
        </TouchableOpacity>
        <View style={styles.btnRegContainer}>
          <TouchableOpacity onPress={handleGoToRegister}>
            <Text style={styles.registerText}>Registruj se</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: screenHeight * 0.02,
    backgroundColor: "#188DFD",
  },
  image: {
    marginBottom: screenHeight * 0.07,
    width: screenWidth * 0.6,
    height: screenHeight * 0.1,
    resizeMode: "contain",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#83C0F9",
    borderRadius: 5,
    marginBottom: screenHeight * 0.02,
    paddingHorizontal: screenWidth * 0.04,
    height: screenHeight * 0.07,
  },
  icon: {
    marginRight: screenWidth * 0.02,
  },
  input: {
    flex: 1,
    fontSize: screenHeight * 0.02,
    color: "#fff",
  },
  loginBtn: {
    height: screenHeight * 0.07,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
  },
  loginBtnText: {
    fontSize: screenHeight * 0.025,
    fontWeight: "bold",
    color: "#188DFD",
  },
  btnRegContainer: {
    width: "100%",
    marginTop: screenHeight * 0.035,
  },
  registerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: screenHeight * 0.02,
  },
});

export default LoginScreen;
