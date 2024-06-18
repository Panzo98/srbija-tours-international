import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { formatPrice } from "../utils/formatPrice";

const { width, height } = Dimensions.get("window");

const PassengerForm = ({ index, passenger }) => {
  const passengersFullInfo = useSelector(
    (state) => state.searchReducer.passengersFullInfo
  );

  const initialUser = {
    name: "",
    lastName: "",
    phone: "",
    birthday: "",
    category: passenger.category,
    price: passenger.price_rsd,
    qrCode: "",
  };

  const [user, setUser] = useState(initialUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!passengersFullInfo[index]) {
      dispatch({
        type: "UPDATE_PASSENGER_INFO",
        payload: { index, data: initialUser },
      });
    }
  }, []);

  const handleChange = (field, value) => {
    const updatedUser = { ...user, [field]: value };
    setUser(updatedUser);
    dispatch({
      type: "UPDATE_PASSENGER_INFO",
      payload: { index, data: updatedUser },
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{
            height: 25,
            width: 25,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            verticalAlign: "center",
            backgroundColor: "#188dfd",
            marginRight: 10,
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {index + 1}
        </Text>
        <Text>Unesite podatke</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Ime (obavezno)"
        placeholderTextColor={"#868484"}
        value={user.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Prezime (obavezno)"
        placeholderTextColor={"#868484"}
        value={user.lastName}
        onChangeText={(text) => handleChange("lastName", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Broj telefona (obavezno)"
        placeholderTextColor={"#868484"}
        value={user.phone}
        onChangeText={(text) => handleChange("phone", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Datum rodjenja (obavezno)"
        placeholderTextColor={"#868484"}
        value={user.birthday}
        onChangeText={(text) => handleChange("birthday", text)}
      />
      <Text style={styles.priceInfoText}>
        Karta za izabranu kategoriju iznosi
      </Text>
      <Text style={styles.priceText}>
        {formatPrice(passenger.price_rsd)} RSD
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 0,
    paddingTop: 0,
  },
  infoText: {
    fontWeight: "300",
    fontSize: height * 0.022,
    textAlign: "center",
  },
  categoryText: {
    fontStyle: "italic",
    fontWeight: "bold",
    fontSize: height * 0.022,
    textAlign: "center",
    marginBottom: height * 0.03,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: height * 0.015,
    marginBottom: height * 0.02,
    fontSize: height * 0.022,
    fontWeight: "bold",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: height * 0.015,
    justifyContent: "center",
    backgroundColor: "#fff",
    marginBottom: height * 0.02,
  },
  dateText: {
    fontSize: height * 0.022,
    color: "#000",
  },
  placeholderText: {
    fontSize: height * 0.022,
    color: "#999",
  },
  datePickerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  datePicker: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: "#188DFD",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
  },
  priceInfoText: {
    fontWeight: "300",
    textAlign: "center",
    fontSize: height * 0.022,
  },
  priceText: {
    textAlign: "center",
    fontSize: height * 0.025,
    fontStyle: "italic",
    fontWeight: "bold",
  },
});

export default PassengerForm;
