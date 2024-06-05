import axios from "../utils/axiosConfig";
import React, { useState } from "react";
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
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { useAssets } from "expo-asset";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const RegisterScreen = ({ navigation }) => {
  const [assets] = useAssets([
    require("../assets/images/company-logo-white.png"),
  ]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();

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

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    try {
      dispatch({ type: "SET_LOADING" });
      let response = await axios.post(
        "/register_passenger",
        {
          first_name: firstName,
          last_name: lastName,
          phone,
          email,
          password,
          password_confirmation: confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { access_token, message } = response.data;
      dispatch({ type: "DISABLE_LOADING" });
      dispatch({ type: "LOGIN_SUCCESS", payload: access_token });
      saveData("token", access_token);
      Alert.alert("Register Status", message);
    } catch (error) {
      dispatch({ type: "DISABLE_LOADING" });
      console.log(error);
      Alert.alert("Register Status", "Registration failed");
    }
  };

  const handleToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
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
            placeholder="Ime korisnika"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="none"
            placeholderTextColor="white"
          />
        </View>
        <View style={styles.inputContainer}>
          <Feather name="user" size={24} color="white" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Prezime korisnika"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="none"
            placeholderTextColor="white"
          />
        </View>
        <View style={styles.inputContainer}>
          <Feather name="phone" size={24} color="white" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Broj telefona"
            value={phone}
            onChangeText={setPhone}
            autoCapitalize="none"
            placeholderTextColor="white"
          />
        </View>
        <View style={styles.inputContainer}>
          <Feather name="mail" size={24} color="white" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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
        <View style={styles.inputContainer}>
          <Feather name="lock" size={24} color="white" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Ponovite lozinku"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            placeholderTextColor="white"
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Feather
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.regBtn} onPress={handleRegister}>
          <Text style={styles.regBtnText}>Kreiraj nalog</Text>
        </TouchableOpacity>
        <View style={styles.btnRegContainer}>
          <TouchableOpacity onPress={handleToLogin}>
            <Text style={styles.loginText}>Već imaš nalog? Prijavi se</Text>
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
  regBtn: {
    height: screenHeight * 0.07,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
  },
  regBtnText: {
    fontSize: screenHeight * 0.025,
    fontWeight: "bold",
    color: "#188DFD",
  },
  btnRegContainer: {
    width: "100%",
    // alignItems: "center",
    marginTop: screenHeight * 0.035,
  },
  loginText: {
    color: "white",
    fontWeight: "bold",
    fontSize: screenHeight * 0.02,
  },
});

export default RegisterScreen;
