import React, { useState } from "react";
import { View, Platform, StyleSheet } from "react-native";
import WheelPickerExpo from "react-native-wheel-picker-expo";
import { Picker } from "react-native-wheel-pick";
import ModalHeader from "./ModalHeader";
import ConfirmModalButton from "./ConfirmModalButton";
import { useDispatch } from "react-redux";

export default function DestCityPicker({
  setData,
  data,
  slideDown,
  modalName,
}) {
  const [selectedCity, setSelectedCity] = useState(null);
  const dispatch = useDispatch();
  const handleValueChange = (value) => {
    setSelectedCity(value);
  };

  const handleConfirm = () => {
    let tempValue = selectedCity ? selectedCity : data[0].name; //u slucaju da se
    const cityDetails = data.find((city) => city.name === tempValue);

    if (cityDetails) {
      // setData({ id_city: cityDetails.id_city, name: cityDetails.name }); // Postavljanje celog objekta
      dispatch({
        type: "SET_DESTINATION",
        payload: { id: cityDetails.id_city, value: cityDetails.name },
      });
      slideDown();
    }
  };

  return (
    <View style={styles.container}>
      <ModalHeader modalName={modalName} slideDown={slideDown} />
      {Platform.OS === "android" ? (
        <WheelPickerExpo
          height={300}
          width={300}
          style={styles.picker}
          items={data.map((city) => ({
            label: city.name,
            value: city.id_city,
          }))}
          onChange={({ item }) => handleValueChange(item.label)}
          selectedIndex={data.findIndex((city) => city.name === selectedCity)}
          haptics={true}
        />
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
          pickerData={data.map((city) => city.name)}
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
