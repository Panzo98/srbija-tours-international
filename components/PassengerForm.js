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
import { format } from "date-fns";

const { width, height } = Dimensions.get("window");

const getMinMaxDateForCategory = (category) => {
  const currentYear = new Date().getFullYear();
  let minDate, maxDate;

  switch (category) {
    case 1:
      minDate = new Date(currentYear - 60, 0, 1);
      maxDate = new Date(currentYear - 26, 11, 31);
      break;
    case 2:
      minDate = new Date(currentYear - 2, 0, 1);
      maxDate = new Date(currentYear, 11, 31);
      break;
    case 3:
      minDate = new Date(currentYear - 12, 0, 1);
      maxDate = new Date(currentYear - 3, 11, 31);
      break;
    case 4:
      minDate = new Date(currentYear - 26, 0, 1);
      maxDate = new Date(currentYear - 13, 11, 31);
      break;
    case 5:
      minDate = new Date(1900, 0, 1);
      maxDate = new Date(currentYear - 60, 11, 31);
      break;
    default:
      minDate = new Date(1900, 0, 1);
      maxDate = new Date(currentYear, 11, 31);
      break;
  }

  return { minDate, maxDate };
};

const PassengerForm = ({ index, passenger, onChange }) => {
  const [user, setUser] = useState(passenger);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempBirthday, setTempBirthday] = useState(new Date());

  useEffect(() => {
    setUser(passenger);
  }, [passenger]);

  const handleChange = (field, value) => {
    const updatedUser = { ...user, [field]: value };
    setUser(updatedUser);
    onChange(field, value);
  };

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === "ios") {
      setTempBirthday(selectedDate || tempBirthday);
    } else {
      setShowDatePicker(false);
      if (selectedDate) {
        handleChange("birthday", format(selectedDate, "yyyy-MM-dd"));
      }
    }
  };

  const confirmDate = () => {
    handleChange("birthday", format(tempBirthday, "yyyy-MM-dd"));
    setShowDatePicker(false);
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

  const { minDate, maxDate } = getMinMaxDateForCategory(passenger?.category);

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>Unesite podatke putnika za kategoriju</Text>
      <Text style={styles.categoryText}>
        "{formatCategoryToDisplay(passenger?.category)}"
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Ime: Pera"
        value={user?.firstName}
        onChangeText={(text) => handleChange("firstName", text)}
        blurOnSubmit={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Prezime: Perić"
        value={user?.lastName}
        onChangeText={(text) => handleChange("lastName", text)}
        blurOnSubmit={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Broj telefona: +381 62 432 34 23"
        value={user?.phone}
        onChangeText={(text) => handleChange("phone", text)}
        blurOnSubmit={false}
      />
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateInput}
      >
        <Text style={user?.birthday ? styles.dateText : styles.placeholderText}>
          {user?.birthday ? user?.birthday : "Datum rođenja: 1990-05-21"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && Platform.OS === "ios" && (
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
                style={{ backgroundColor: "white" }}
                mode="date"
                display="spinner"
                onChange={onChangeDate}
                minimumDate={minDate}
                maximumDate={maxDate}
                textColor="black" // Set text color to black
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
      {showDatePicker && Platform.OS !== "ios" && (
        <DateTimePicker
          value={tempBirthday}
          style={{ backgroundColor: "white" }}
          mode="date"
          display="default"
          onChange={onChangeDate}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      )}
      <Text style={styles.priceInfoText}>
        Karta za izabranu kategoriju iznosi
      </Text>
      <Text style={styles.priceText}>{passenger?.price_rsd} RSD</Text>
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
