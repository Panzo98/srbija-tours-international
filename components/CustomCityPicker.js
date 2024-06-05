import React, { useState } from "react";
import { View, Platform, StyleSheet } from "react-native";
import WheelPickerExpo from "react-native-wheel-picker-expo";
import { Picker } from "react-native-wheel-pick";
import ModalHeader from "./ModalHeader";
import ConfirmModalButton from "./ConfirmModalButton";
import { useDispatch } from "react-redux";

export default function CustomCityPicker({ data, slideDown, modalName }) {
  const [selectedCity, setSelectedCity] = useState(null);
  const dispatch = useDispatch();

  const handleValueChange = (value) => {
    setSelectedCity(value);
  };

  const handleConfirm = () => {
    let tempValue = selectedCity ? selectedCity : data[0].value; //u slucaju da se
    const cityDetails = data.find((city) => city.value === tempValue);

    if (cityDetails) {
      dispatch({
        type: "SET_DEPARTURE",
        payload: { id: cityDetails.key, value: cityDetails.value },
      });
      slideDown();
    }
  };

  return (
    <View style={styles.container}>
      <ModalHeader modalName={modalName} slideDown={slideDown} />
      {Platform.OS === "android" ? (
        <View
          style={{
            width: "100%",
            borderBottomColor: "#e2e2e2",
            borderTopColor: "#e2e2e2",
            borderBottomWidth: 1,
            borderTopWidth: 1,
            marginBottom: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <WheelPickerExpo
            height={250}
            width={250}
            style={styles.picker}
            items={data.map((city) => ({ label: city.value, value: city.key }))}
            onChange={({ item }) => handleValueChange(item.label)}
            selectedIndex={data.findIndex(
              (city) => city.value === selectedCity
            )}
            haptics={true}
          />
        </View>
      ) : (
        <Picker
          style={{
            backgroundColor: "white",
            width: "100%",
            height: 215,
            borderBottomColor: "#e2e2e2",
            borderTopColor: "#e2e2e2",
            borderBottomWidth: 1,
            borderTopWidth: 1,
            marginBottom: 10,
          }}
          selectedValue={selectedCity}
          pickerData={data.map((city) => city.value)}
          onValueChange={handleValueChange}
        />
      )}
      <ConfirmModalButton handleConfirm={handleConfirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    backgroundColor: "white",
    width: "100%",
    height: 215,
  },
});
