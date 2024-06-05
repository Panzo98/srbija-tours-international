import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ModalHeader from "./ModalHeader";
import ConfirmModalButton from "./ConfirmModalButton";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const CustomPassengersPicker = ({ slideDown, modalName }) => {
  const dispatch = useDispatch();

  const passengers = useSelector((state) => state.searchReducer.passengers);
  const finalPassengersCount = passengers.reduce((total, passenger) => {
    return total + passenger.count;
  }, 0);

  const handleAddPassenger = (categoryId) => {
    if (finalPassengersCount < 7) {
      return dispatch({
        type: "PASSENGER_INCREMENT",
        payload: categoryId,
      });
    } else {
      return Alert.alert(
        "Upozorenje",
        "Maksimalan broj putnika po rezervaciji je 7!"
      );
    }
  };

  return (
    <View>
      <ModalHeader modalName={modalName} slideDown={slideDown} />
      <View style={styles.container}>
        {passengers.map((item, index) => (
          <View key={index} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelText}>{item.label}</Text>
            </View>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                onPress={() =>
                  dispatch({
                    type: "PASSENGER_DECREMENT",
                    payload: item.categoryId,
                  })
                }
                style={styles.button}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.countText}>{item.count}</Text>
              <TouchableOpacity
                onPress={() => handleAddPassenger(item.categoryId)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={styles.confirmContainer}>
          <ConfirmModalButton handleConfirm={slideDown} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // padding: screenWidth * 0.04,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: screenHeight * 0.01,
    borderBottomColor: "#e2e2e2",
    borderBottomWidth: 1,
    paddingBottom: screenHeight * 0.01,
  },
  labelText: {
    fontSize: screenHeight * 0.02,
    fontWeight: "200",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    marginHorizontal: screenWidth * 0.02,
    borderRadius: 5,
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#c9c8c9",
    borderWidth: 1,
  },
  buttonText: {
    color: "#c9c8c9",
    fontSize: screenHeight * 0.025,
  },
  countText: {
    fontSize: screenHeight * 0.025,
    width: screenWidth * 0.1,
    textAlign: "center",
  },
  confirmContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: screenHeight * 0.02,
  },
});

export default CustomPassengersPicker;
