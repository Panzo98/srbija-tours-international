import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { formatPrice } from "../utils/formatPrice";

const { width, height } = Dimensions.get("window");

const PassengerForm = ({ index, passenger }) => {
  const passengersFullInfo = useSelector(
    (state) => state.searchReducer.passengersFullInfo
  );

  const initialUser = passengersFullInfo[index] || {
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

  const formatCategoryToDisplay = (category) => {
    switch (category) {
      case 1:
        return "Odrasli 26-60";
      case 2:
        return "Bebe 0-2";
      case 3:
        return "Deca 3-12";
      case 4:
        return "Mladi 13-26";
      case 5:
        return "Senior 60+";
      default:
        return "Pogrešna kategorija";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>Unesite podatke putnika za kategoriju</Text>
      <Text style={styles.categoryText}>
        "{formatCategoryToDisplay(passenger.category)}"
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Ime: Pera"
        value={user.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Prezime: Perić"
        value={user.lastName}
        onChangeText={(text) => handleChange("lastName", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Broj telefona: +381 62 432 34 23"
        value={user.phone}
        onChangeText={(text) => handleChange("phone", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Datum rođenja: 1990-05-21"
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
