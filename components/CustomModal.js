import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";

import CustomCalendar from "./CustomCalendar";
import CustomPassengersPicker from "./CustomPassengersPicker";
import CustomBirthdayPicker from "./CustomBirthdayPicker";
import SearchCity from "./SearchCity";

const BottomSheet = ({ modalInfo, setModalInfo }) => {
  const slide = useRef(new Animated.Value(300)).current;

  const slideUp = () => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const slideDown = () => {
    Animated.timing(slide, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalInfo({ data: null, type: null, setData: null, isVisible: false });
      slide.setValue(300); // Resetuje slide poziciju nakon zatvaranja
    });
  };

  useEffect(() => {
    if (modalInfo.isVisible) {
      slideUp();
    }
  }, [modalInfo.isVisible]);

  const renderContent = () => {
    switch (modalInfo.type) {
      case "date":
        return (
          <CustomCalendar
            setData={modalInfo.setData}
            enabledDates={modalInfo.data}
            slideDown={slideDown}
            modalName={modalInfo.modalName}
          />
        );
      case "city":
        return (
          <SearchCity
            setData={modalInfo.setData}
            data={modalInfo.data}
            slideDown={slideDown}
            modalName={modalInfo.modalName}
            type="departure"
          />
        );
      case "cityDest":
        return (
          <SearchCity
            setData={modalInfo.setData}
            data={modalInfo.data}
            slideDown={slideDown}
            modalName={modalInfo.modalName}
            type="destination"
          />
        );
      case "passengers":
        return (
          <CustomPassengersPicker
            setData={modalInfo.setData}
            data={modalInfo.data}
            slideDown={slideDown}
            modalName={modalInfo.modalName}
          />
        );
      case "BirthDay":
        return (
          <CustomBirthdayPicker
            slideDown={slideDown}
            modalName={modalInfo.modalName}
          />
        );
      default:
        return <Text>Neodređen modal</Text>;
    }
  };

  return (
    <Modal
      visible={modalInfo.isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={slideDown}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.closeArea} onPress={slideDown} />
        <Animated.View
          style={[styles.bottomSheet, { transform: [{ translateY: slide }] }]}
        >
          {renderContent()}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bottomSheet: {
    width: "100%",
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 15,
    paddingBottom: 35,
    paddingTop: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#bcbcbc",
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "white",
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#40A2E3",
    alignItems: "center",
    marginTop: 15,
  },
  closeArea: {
    flex: 1, // Zauzima preostali prostor
    width: "100%",
  },
});
