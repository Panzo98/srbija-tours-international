import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const PassengerInput = ({ passengerInfo, handleChange }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder="Ime"
        value={passengerInfo.name}
        onChangeText={(text) => handleChange("name", text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Prezime"
        value={passengerInfo.lastName}
        onChangeText={(text) => handleChange("lastName", text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Telefon"
        value={passengerInfo.phone}
        onChangeText={(text) => handleChange("phone", text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Datum rođenja"
        value={passengerInfo.birthday}
        onChangeText={(text) => handleChange("birthday", text)}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    padding: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#f5f5f5",
  },
});

export default PassengerInput;
