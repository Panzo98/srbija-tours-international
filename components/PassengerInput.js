import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

const PassengerInput = ({ passengerInfo, handleChange }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempBirthday, setTempBirthday] = useState(new Date());

  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      setTempBirthday(selectedDate);
    }
  };

  const confirmDate = () => {
    handleChange("birthday", format(tempBirthday, "yyyy-MM-dd"));
    setShowDatePicker(false);
  };

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
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateInput}
      >
        <Text style={styles.dateText}>
          {passengerInfo.birthday ? passengerInfo.birthday : "Datum rođenja"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.datePickerContainer}>
            <View style={styles.datePicker}>
              <DateTimePicker
                value={tempBirthday}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmDate}
              >
                <Text style={styles.confirmButtonText}>Potvrdi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  dateInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  dateText: {
    fontSize: 16,
    color: "#000",
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
});

export default PassengerInput;
