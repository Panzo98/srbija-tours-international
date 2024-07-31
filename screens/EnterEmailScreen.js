import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomScreenHeader from "../components/CustomScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");

const EnterEmailScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const email = useSelector((state) => state.searchReducer.email);
  const [localEmail, setLocalEmail] = useState(email || "");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    setLocalEmail(email || "");

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [email]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = () => {
    if (!localEmail) {
      Alert.alert("Upozorenje", "Molimo vas da unesete email.");
      return;
    }
    if (!isValidEmail(localEmail)) {
      Alert.alert("Upozorenje", "Molimo vas da unesete validnu email adresu.");
      return;
    }
    dispatch({ type: "SET_EMAIL", payload: localEmail });
    navigation.navigate("PreOrderScreen");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea} edges={["left", "right", "top"]}>
        <CustomScreenHeader title="Unesite Email" navigation={navigation} />
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email: example@example.com"
              value={localEmail}
              onChangeText={setLocalEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#888"
            />
          </View>
        </View>
        {!isKeyboardVisible && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.buttonText}>DALJE</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#188dfd",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: width * 0.04,
    backgroundColor: "white",
  },
  inputContainer: {
    marginTop: height * 0.02,
  },
  input: {
    width: "100%",
    height: height * 0.07,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: height * 0.02,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.03,
    backgroundColor: "white",
  },
  nextButton: {
    backgroundColor: "#188DFD",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.07,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EnterEmailScreen;
