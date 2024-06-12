import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import PassengerForm from "../components/PassengerForm";
import CustomScreenHeader from "../components/CustomScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const PreOrderScreen = ({ navigation }) => {
  const passengers = useSelector((state) => state.passengersReducer);
  const passengersFullInfo = useSelector(
    (state) => state.searchReducer.passengersFullInfo
  );
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    const passenger = passengersFullInfo[currentStep];
    if (
      !passenger.name ||
      !passenger.lastName ||
      !passenger.phone ||
      !passenger.birthday
    ) {
      Alert.alert(
        "Upozorenje",
        "Molimo vas da popunite sva polja pre nego što nastavite dalje."
      );
      return;
    }

    if (currentStep < passengers.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate("PaymentMethodScreen");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isCurrentStepComplete = () => {
    const passenger = passengersFullInfo[currentStep];
    return (
      passenger?.name !== "" &&
      passenger?.lastName !== "" &&
      passenger?.phone !== "" &&
      passenger?.birthday !== ""
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomScreenHeader
        title={"Unos podataka za putnike"}
        navigation={navigation}
      />
      <View style={styles.container}>
        {passengers.length > 1 && (
          <View style={styles.stepperContainer}>
            {passengers.map((_, index) => (
              <React.Fragment key={index}>
                <View
                  style={[
                    styles.step,
                    index <= currentStep
                      ? styles.activeStep
                      : styles.inactiveStep,
                    {
                      marginTop: index === 0 ? 0 : height * 0.015,
                      marginBottom: height * 0.015,
                    },
                  ]}
                >
                  <Text style={styles.stepText}>{index + 1}</Text>
                </View>
                {index < passengers.length - 1 && (
                  <View style={styles.stepLine} />
                )}
              </React.Fragment>
            ))}
          </View>
        )}
        <View
          style={[
            styles.formContainer,
            passengers.length === 1 && { width: "100%" },
          ]}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <PassengerForm
              key={currentStep}
              index={currentStep}
              passenger={passengers[currentStep]}
            />
          </ScrollView>
        </View>
      </View>
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
          ]}
          onPress={handleNext}
          disabled={!isCurrentStepComplete()}
        >
          <Text style={styles.navButtonText}>
            {currentStep === passengers.length - 1 ? "DALJE" : "SLEDEĆI"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: width * 0.03,
    paddingRight: width * 0.05,
    paddingTop: height * 0.03,
    paddingBottom: 0,
  },
  stepperContainer: {
    width: "10%",
    alignItems: "center",
  },
  step: {
    width: height * 0.04,
    height: height * 0.04,
    borderRadius: height * 0.02,
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.02,
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
    width: 2,
    height: height * 0.01,
    backgroundColor: "#ccc",
    marginRight: width * 0.02,
  },
  formContainer: {
    width: "90%",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.04,
  },
  navButton: {
    width: "90%",
    backgroundColor: "#188dfd",
    padding: height * 0.02,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    // marginHorizontal: width * 0.02, TODO odvojiti buttons
  },
  disabledButton: {
    backgroundColor: "#B0C4DE",
  },
  navButtonText: {
    color: "white",
    fontSize: height * 0.025,
    fontWeight: "bold",
  },
});

export default PreOrderScreen;
