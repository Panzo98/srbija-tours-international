import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ModalHeader from "./ModalHeader";
import { useDispatch } from "react-redux";
// import DatePicker from "react-native-date-picker";

const CustomCalendar = ({ slideDown, modalName }) => {
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());

  return (
    <View>
      <ModalHeader modalName={modalName} slideDown={slideDown} />
      {/* <DatePicker date={date} onDateChange={setDate} /> */}
    </View>
  );
};

export default CustomCalendar;
