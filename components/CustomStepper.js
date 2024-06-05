import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import PassengerInput from "./PassengerInput";
import Collapsible from "react-native-collapsible";
import { useFocusEffect } from "@react-navigation/native";

const { height: windowHeight } = Dimensions.get("window");

const CustomStepper = ({ setModalInfo, modalInfo, navigation }) => {
  const passengersReducer = useSelector((state) => state.passengersReducer);

  const initialPassengersInfo = passengersReducer.map((passenger) => ({
    name: "",
    lastName: "",
    phone: "",
    price: passenger.price_rsd,
    categoryTitle: passenger.name,
    category: passenger.category,
    birthday: "",
  }));

  const [passengersInfo, setPassengersInfo] = useState(initialPassengersInfo);
  const [currentStep, setCurrentStep] = useState(0);
  const [collapsedSteps, setCollapsedSteps] = useState([
    false,
    ...Array(initialPassengersInfo.length - 1).fill(true),
  ]);
  const [availableHeight, setAvailableHeight] = useState(windowHeight);

  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    const remainingHeight = windowHeight - height;
    setAvailableHeight(remainingHeight);
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedInfo = [...passengersInfo];
    updatedInfo[index][field] = value;
    setPassengersInfo(updatedInfo);
  };

  const toggleCollapse = (index) => {
    const updatedCollapsedSteps = collapsedSteps.map((collapsed, i) =>
      i === index ? !collapsed : collapsed
    );
    setCollapsedSteps(updatedCollapsedSteps);
  };

  const nextStep = () => {
    if (
      passengersInfo[currentStep].name === "" ||
      passengersInfo[currentStep].lastName === "" ||
      passengersInfo[currentStep].phone === "" ||
      passengersInfo[currentStep].birthday === ""
    )
      return Alert.alert(
        "Upozorenje",
        "Popunite sva polja potrebna kako bi ste nastavili dalje sa unosom"
      );

    if (currentStep < passengersInfo.length - 1) {
      const updatedCollapsedSteps = collapsedSteps.map((collapsed, i) =>
        i === currentStep ? true : i === currentStep + 1 ? false : collapsed
      );
      setCollapsedSteps(updatedCollapsedSteps);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const updatedCollapsedSteps = collapsedSteps.map((collapsed, i) =>
        i === currentStep ? true : i === currentStep - 1 ? false : collapsed
      );
      setCollapsedSteps(updatedCollapsedSteps);
      setCurrentStep(currentStep - 1);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setPassengersInfo(initialPassengersInfo);
      setCurrentStep(0);
      setCollapsedSteps([
        false,
        ...Array(initialPassengersInfo.length - 1).fill(true),
      ]);
      return () => {
        setPassengersInfo([]);
        setCurrentStep(0);
      };
    }, [passengersReducer.length])
  );

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { maxHeight: availableHeight },
        ]}
      >
        {passengersInfo.map((passenger, index) => (
          <View key={index} style={styles.card}>
            <TouchableOpacity onPress={() => toggleCollapse(index)}>
              <View style={styles.header}>
                <Text style={styles.title}>Putnik {index + 1}</Text>
              </View>
            </TouchableOpacity>
            <Collapsible collapsed={collapsedSteps[index]}>
              <PassengerInput
                index={index}
                passengerInfo={passenger}
                handleChange={(field, value) =>
                  handlePassengerChange(index, field, value)
                }
                totalPassengers={passengersInfo.length}
              />
              <View style={styles.buttonsContainer}>
                {index > 0 && (
                  <TouchableOpacity style={styles.navButton} onPress={prevStep}>
                    <Text style={styles.navButtonText}>PRETHODNI</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.navButton, { marginLeft: index > 0 ? 10 : 0 }]}
                  onPress={nextStep}
                >
                  <Text style={styles.navButtonText}>
                    {index === passengersInfo.length - 1 ? "DALJE" : "SLEDEĆI"}
                  </Text>
                </TouchableOpacity>
              </View>
            </Collapsible>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  card: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#f7f7f7",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  navButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#188dfd",
    alignItems: "center",
    flex: 1,
  },
  navButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomStepper;
