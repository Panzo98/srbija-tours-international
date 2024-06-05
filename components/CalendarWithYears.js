import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { PickerIOS, Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";

const MyCalendar = () => {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, index) =>
    (currentYear - 5 + index).toString()
  );

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedYear}
        onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}
      >
        {years.map((year) => (
          <Picker.Item key={year} label={year} value={year} />
        ))}
      </Picker>
      <Calendar
        style={{ height: 300 }}
        current={`${selectedYear}-01-01`} // Setting January 1st of the selected year
        onMonthChange={(month) => {
          console.log("month changed", month);
        }}
        // Additional Calendar props
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    height: 500,
  },
});

export default MyCalendar;
