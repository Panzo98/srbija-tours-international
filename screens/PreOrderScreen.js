import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import PassengerForm from "../components/PassengerForm";
import CustomScreenHeader from "../components/CustomScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const PreOrderScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const originalPassengersInfo = useSelector(
    (state) => state.searchReducer.originalPassengersFullInfo
  );
  const [editedPassengersInfo, setEditedPassengersInfo] = useState(
    originalPassengersInfo
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    setEditedPassengersInfo(originalPassengersInfo);

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
  }, [originalPassengersInfo]);

  useFocusEffect(
    useCallback(() => {
      setEditedPassengersInfo(originalPassengersInfo);
    }, [originalPassengersInfo])
  );
  useFocusEffect(
    useCallback(() => {
      setCurrentStep(0);
    }, [])
  );

  const handleNext = () => {
    const passenger = editedPassengersInfo[currentStep];
    if (
      !passenger?.firstName ||
      !passenger?.lastName ||
      !passenger?.phone ||
      !passenger?.birthday
    ) {
      Alert.alert(
        "Upozorenje",
        "Molimo vas da popunite sva polja pre nego što nastavite dalje."
      );
      return;
    }
    if (currentStep < editedPassengersInfo.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate("PaymentMethodScreen", {
        passengersInfo: editedPassengersInfo,
      });
      dispatch({
        type: "UPDATE_PASSENGERS_INFO",
        payload: editedPassengersInfo,
      });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isCurrentStepComplete = () => {
    const passenger = editedPassengersInfo[currentStep];
    return (
      passenger?.firstName !== "" &&
      passenger?.lastName !== "" &&
      passenger?.phone !== "" &&
      passenger?.birthday !== ""
    );
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...editedPassengersInfo];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setEditedPassengersInfo(updatedPassengers);
    dispatch({ type: "UPDATE_PASSENGERS_INFO", payload: updatedPassengers });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <CustomScreenHeader
          title={"Unos podataka za putnike"}
          navigation={navigation}
        />
        <View style={styles.container}>
          {editedPassengersInfo.length > 1 && (
            <View style={styles.stepperContainer}>
              {editedPassengersInfo.map((_, index) => (
                <React.Fragment key={index}>
                  <View
                    style={[
                      styles.step,
                      index <= currentStep
                        ? styles.activeStep
                        : styles.inactiveStep,
                    ]}
                  >
                    <Text style={styles.stepText}>{index + 1}</Text>
                  </View>
                  {index < editedPassengersInfo.length - 1 && (
                    <View style={styles.stepLine} />
                  )}
                </React.Fragment>
              ))}
            </View>
          )}
          <View
            style={[
              styles.formContainer,
              editedPassengersInfo.length === 1 && { width: "100%" },
            ]}
          >
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              keyboardShouldPersistTaps="always"
            >
              <PassengerForm
                key={currentStep}
                index={currentStep}
                passenger={editedPassengersInfo[currentStep]}
                onChange={(field, value) =>
                  handlePassengerChange(currentStep, field, value)
                }
              />
            </ScrollView>
          </View>
        </View>
        {!isKeyboardVisible && (
          <View style={styles.buttonContainer}>
            {currentStep > 0 && (
              <TouchableOpacity style={styles.navButton} onPress={handlePrev}>
                <Text style={styles.navButtonText}>PRETHODNI</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.navButton,
                !isCurrentStepComplete() && styles.disabledButton,
                currentStep > 0 ? { width: "48%" } : { width: "100%" },
              ]}
              onPress={handleNext}
              disabled={!isCurrentStepComplete()}
            >
              <Text style={styles.navButtonText}>
                {currentStep === editedPassengersInfo.length - 1
                  ? "DALJE"
                  : "SLEDEĆI"}
              </Text>
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
  container: {
    flex: 1,
    flexDirection: "column",
    paddingLeft: width * 0.03,
    paddingRight: width * 0.05,
    paddingTop: height * 0.03,
    paddingBottom: 0,
    backgroundColor: "white",
  },
  stepperContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  step: {
    width: height * 0.04,
    height: height * 0.04,
    borderRadius: height * 0.02,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: width * 0.01,
  },
  activeStep: {
    backgroundColor: "#188dfd",
  },
  inactiveStep: {
    backgroundColor: "#ccc",
  },
  stepText: {
    color: "#fff",
    fontWeight: "bold",
  },
  stepLine: {
    width: 10,
    height: 2,
    backgroundColor: "#ccc",
    marginHorizontal: width * 0.01,
  },
  formContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  buttonContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.04,
  },
  navButton: {
    backgroundColor: "#188dfd",
    padding: height * 0.02,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  disabledButton: {
    backgroundColor: "#B0C4DE",
  },
  navButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PreOrderScreen;
