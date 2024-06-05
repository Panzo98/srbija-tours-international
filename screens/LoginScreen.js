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
} from "react-native";

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
  const [assets] = useAssets([
    require("../assets/images/company-logo-white.png"),
  ]);
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
      console.log(response?.data);
    }
  };

  const handleGoToRegister = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Register" }],
    });
  };

  if (!assets)
    return (
      <View>
        <Text>Učitavanje</Text>
      </View>
    );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={assets[0]} style={styles.image} />
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
    // alignItems: "center",
    marginTop: screenHeight * 0.035,
  },
  registerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: screenHeight * 0.02,
  },
});

export default LoginScreen;
