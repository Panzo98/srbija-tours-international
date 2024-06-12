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
import { formatPassengersForBackend } from "../utils/formatPassengersForBackend";
import QRCode from "react-native-qrcode-svg";

const { width, height } = Dimensions.get("window");

export default function PaymentMethodScreen({ navigation }) {
  const {
    id_departure,
    departure,
    destination,
    departureDate,
    paymentMethod,
    direction,
    total,
    passengersFullInfo,
    email,
  } = useSelector((state) => state.searchReducer);
  const passengerssss = useSelector((state) => state.passengersReducer);
  const [selected, setSelected] = useState(null);

  const handleSelect = (selectedIndex) => {
    setSelected(selectedIndex);
  };
  const dispatch = useDispatch();

  const handleBuy = async () => {
    try {
      dispatch({ type: "SET_LOADING" });
      let response = await axios.post(
        "https://drivesoft-srbijatours.com/api/v1/reservations",
        {
          id_departure,
          departure: departure.id,
          destination: destination.id,
          departureDate,
          paymentMethod: selected,
          direction,
          total,
          passengers: formatPassengersForBackend(passengersFullInfo),
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch({ type: "DISABLE_LOADING" });
      Alert.alert("Uspješno", "Uspješno ste rezervisali karte");
      let _reservation_ids = response.data.reservation_ids;
      dispatch({
        type: "ASSIGN_RESERVATION_IDS_TO_PASSENGERS",
        payload: _reservation_ids,
      });
      navigation.navigate("ConfirmationScreen");
    } catch (error) {
      dispatch({ type: "DISABLE_LOADING" });
      Alert.alert("Greška", "Desila se greška prilikom rezervacije karte!");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    padding: width * 0.04,
    flex: 1,
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
    borderRadius: 5,
    justifyContent: "center",
    // paddingVertical: height * 0.03,
    alignItems: "center",
    height: height * 0.07,
    marginHorizontal: width * 0.04,

    // marginHorizontal: width * 0.05,
    // marginBottom: height * 0.03,
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
