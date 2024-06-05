import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import XDate from "xdate";
import ModalHeader from "./ModalHeader";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const CustomCalendar = ({ enabledDates, slideDown, modalName }) => {
  const dispatch = useDispatch();

  const handleDayPress = (day) => {
    if (
      enabledDates[day.dateString] &&
      !enabledDates[day.dateString].disabled
    ) {
      dispatch({
        type:
          modalName === "Polasci" ? "SET_DEPARTURE_DATE" : "SET_RETURN_DATE",
        payload: day.dateString,
      });
      slideDown();
    } else {
      console.log("Date is not allowed.");
    }
  };

  const customDayComponent = ({ date, state }) => {
    let dayStyle = {
      textAlign: "center",
      color: state === "disabled" ? "gray" : "black",
      padding: screenHeight * 0.015,
      borderRadius: 5,
      fontSize: screenHeight * 0.022,
    };

    if (
      enabledDates[date.dateString] &&
      !enabledDates[date.dateString].disabled
    ) {
      dayStyle.color = "black";
      dayStyle.fontWeight = "600";
    } else {
      dayStyle.color = "#adadad";
    }

    return (
      <TouchableOpacity onPress={() => handleDayPress(date)}>
        <Text style={dayStyle}>{date.day}</Text>
      </TouchableOpacity>
    );
  };

  LocaleConfig.locales["sr"] = {
    monthNames: [
      "Januar",
      "Februar",
      "Mart",
      "April",
      "Maj",
      "Jun",
      "Jul",
      "Avgust",
      "Septembar",
      "Oktobar",
      "Novembar",
      "Decembar",
    ],
    monthNamesShort: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Maj",
      "Jun",
      "Jul",
      "Avg",
      "Sep",
      "Okt",
      "Nov",
      "Dec",
    ],
    dayNames: [
      "Nedelja",
      "Ponedeljak",
      "Utorak",
      "Sreda",
      "Četvrtak",
      "Petak",
      "Subota",
    ],
    dayNamesShort: ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub"],
  };
  LocaleConfig.defaultLocale = "sr";

  XDate.locales["sr"] = {
    monthNames: LocaleConfig.locales["sr"].monthNames,
    monthNamesShort: LocaleConfig.locales["sr"].monthNamesShort,
    dayNames: LocaleConfig.locales["sr"].dayNames,
    dayNamesShort: LocaleConfig.locales["sr"].dayNamesShort,
  };
  XDate.defaultLocale = "sr";

  return (
    <View>
      <ModalHeader modalName={modalName} slideDown={slideDown} />
      <Calendar
        onDayPress={handleDayPress}
        markedDates={enabledDates}
        hideExtraDays={true}
        dayComponent={customDayComponent}
        renderArrow={(direction) => (
          <Ionicons
            name={direction === "left" ? "chevron-back" : "chevron-forward"}
            size={screenHeight * 0.03}
            color="black"
          />
        )}
        theme={{
          arrowColor: "black",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "bold",
          textDayFontSize: screenHeight * 0.019,
          textMonthFontSize: screenHeight * 0.025,
          monthTextColor: "black",
          textDayHeaderFontSize: screenHeight * 0.02,
        }}
        style={styles.calendar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    width: screenWidth * 0.95,
    alignSelf: "center",
  },
});

export default CustomCalendar;
