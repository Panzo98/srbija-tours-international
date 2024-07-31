import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import CustomScreenHeader from "../components/CustomScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

const { width, height } = Dimensions.get("window");

export default function PaymentMethodScreen({ navigation, route }) {
  const {
    id_departure,
    departure,
    destination,
    departureDate,
    paymentMethod,
    direction,
    total,
    email,
  } = useSelector((state) => state.searchReducer);
  const { passengersInfo } = route.params;
  const isAuthenticated = useSelector((state) => state.auth);
  const [selected, setSelected] = useState(null);
  const dispatch = useDispatch();

  const handleSelect = async (selectedIndex) => {
    setSelected(selectedIndex);
  };
  const handleBuy = async () => {
    try {
      dispatch({ type: "SET_LOADING" });
      const reservationData = {
        passenger_id: isAuthenticated.isAuthenticated
          ? isAuthenticated.user.id
          : null,
        id_departure,
        departure: departure.id,
        destination: destination.id,
        departureDate,
        paymentMethod: selected,
        direction,
        total,
        passengers: passengersInfo,
        email: isAuthenticated.isAuthenticated
          ? isAuthenticated.user.email
          : email,
      };
      if (isAuthenticated.isAuthenticated) {
        await handleAuthenticatedUser(reservationData);
      } else {
        await handleUnauthenticatedUser(reservationData);
      }

      navigation.navigate("ConfirmationScreen", {
        passengersFullInfo: passengersInfo,
      });
    } catch (error) {
      dispatch({ type: "DISABLE_LOADING" });
      Alert.alert("Greška", "Desila se greška prilikom rezervacije karte!");
      console.error(error);
    } finally {
      dispatch({ type: "DISABLE_LOADING" });
    }
  };

  const handleAuthenticatedUser = async (reservationData) => {
    try {
      const response = await axios.post(
        "https://drivesoft-srbijatours.com/api/v1/reservations",
        reservationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      Alert.alert("Uspješno", "Uspješno ste rezervisali karte");
    } catch (error) {
      console.error("Error during handleAuthenticatedUser:", error);
      throw error;
    }
  };

  const handleUnauthenticatedUser = async (reservationData) => {
    try {
      const response = await axios.post(
        "https://drivesoft-srbijatours.com/api/v1/reservations",
        reservationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const reservationsData = response.data.reservations?.data || [];

      const storedTickets =
        JSON.parse(await SecureStore.getItemAsync("tickets")) || [];
      await SecureStore.setItemAsync(
        "tickets",
        JSON.stringify([...storedTickets, ...reservationsData])
      );

      Alert.alert("Uspješno", "Uspješno ste rezervisali karte");
    } catch (error) {
      console.error("Error during handleUnauthenticatedUser:", error);
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "top"]}>
      <CustomScreenHeader title={"Način plaćanja"} navigation={navigation} />
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => handleSelect(1)}
          style={[styles.cardContainer, selected === 1 && styles.selectedCard]}
        >
          <View style={styles.cardContent}>
            <MaterialIcons
              name="directions-bus"
              size={height * 0.04}
              color="#188DFD"
            />
            <Text style={styles.cardText}>Plati u autobusu</Text>
          </View>
          <View style={styles.iconContainer}>
            {selected === 1 ? (
              <Ionicons
                name="checkmark-circle"
                size={height * 0.04}
                color="#188DFD"
              />
            ) : (
              <Ionicons
                name="ellipse-outline"
                size={height * 0.04}
                color="#188DFD"
              />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSelect(2)}
          disabled
          style={[styles.cardContainer, selected === 2 && styles.selectedCard]}
        >
          <View style={styles.cardContent}>
            <FontAwesome
              name="credit-card"
              size={height * 0.04}
              color="#188DFD"
            />
            <Text style={styles.cardText}>Plati karticom</Text>
          </View>
          <View style={styles.iconContainer}>
            {selected === 2 ? (
              <Ionicons
                name="checkmark-circle"
                size={height * 0.04}
                color="#188DFD"
              />
            ) : (
              <Ionicons
                name="ellipse-outline"
                size={height * 0.04}
                color="#188DFD"
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: "#F5f4f4" }}>
        <TouchableOpacity
          style={[
            styles.finishButton,
            selected === null && styles.disabledButton,
          ]}
          onPress={handleBuy}
          disabled={selected === null}
        >
          <Text style={styles.buttonText}>DALJE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#188dfd",
  },
  content: {
    padding: width * 0.04,
    flex: 1,
    backgroundColor: "#F5F4F4",
  },
  cardContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    paddingVertical: height * 0.04,
    paddingHorizontal: width * 0.04,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5.46,
    elevation: 9,
    marginBottom: height * 0.02,
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: "#188DFD",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardText: {
    fontSize: height * 0.025,
    marginLeft: width * 0.04,
    fontWeight: "500",
  },
  iconContainer: {
    marginLeft: width * 0.04,
  },
  finishButton: {
    backgroundColor: "#188DFD",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: width * 0.04,
    height: height * 0.07,
    borderRadius: 5,
    marginBottom: height * 0.03,
  },
  disabledButton: {
    backgroundColor: "#B0C4DE",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
