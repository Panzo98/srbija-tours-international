import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useDispatch } from "react-redux";
import { formatPrice } from "../utils/formatPrice";
import { useAssets } from "expo-asset";

const { width, height } = Dimensions.get("window");

const PricesWithInfoCard = ({
  data,
  totalPrice,
  navigation,
  passCatPriceSr,
  selectedLine,
  setSelectedLine,
}) => {
  function formatTimeToHoursAndMinutesOnly(time) {
    const [hours, minutes] = time.split(":");
    const hoursNum = parseInt(hours, 10);
    const period = hoursNum >= 12 ? "PM" : "AM";
    const formattedHours = hoursNum % 12 || 12;
    const formattedHoursStr = formattedHours.toString().padStart(2, "0");
    return `${formattedHoursStr}:${minutes} ${period}`;
  }

  const calculateTravellingTime = (
    departureTime,
    departureDay,
    arrivalTime,
    arrivalDay
  ) => {
    const departureDateTime = new Date(
      `2024-01-0${departureDay}T${departureTime}`
    );
    const arrivalDateTime = new Date(`2024-01-0${arrivalDay}T${arrivalTime}`);
    const timeDifference = arrivalDateTime - departureDateTime;
    const minutes = Math.floor(timeDifference / (1000 * 60));
    const totalHours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${totalHours}:${remainingMinutes.toString().padStart(2, "0")} hrs`;
  };

  const [assets] = useAssets([
    require("../assets/icons/arrow-down.png"),
    require("../assets/icons/electrical.png"),
    require("../assets/icons/toilet.png"),
    require("../assets/icons/wifi.png"),
    require("../assets/icons/bus.png"),
  ]);

  const handleSelect = () => {
    setSelectedLine({
      id_departure: data.id_departure,
      totalPrice: totalPrice,
      passCatPriceSr: passCatPriceSr,
    });
  };

  if (!assets)
    return (
      <View>
        <Text>Učitavanje</Text>
      </View>
    );

  return (
    <TouchableOpacity
      style={[
        styles.container,
        selectedLine?.id_departure === data.id_departure && styles.selectedCard,
      ]}
      onPress={handleSelect}
    >
      <View style={styles.scheduleContainer}>
        <View>
          <Text style={styles.time}>
            {formatTimeToHoursAndMinutesOnly(data.departure_time)}
          </Text>
          <Text style={styles.time}>
            {formatTimeToHoursAndMinutesOnly(data.arrival_time)}
          </Text>
        </View>

        <Image source={assets[0]} style={styles.arrow} />
        <View>
          <Text style={styles.station}>
            AS{" "}
            {data.fromCityName[0].toUpperCase() +
              data.fromCityName.substring(1)}
          </Text>
          <Text style={styles.station}>
            AS {data.toCityName[0].toUpperCase() + data.toCityName.substring(1)}
          </Text>
        </View>
      </View>
      <View style={styles.separatorLine}></View>
      <View style={styles.detailsContainer}>
        <View style={styles.infoContainer}>
          <View style={styles.iconContainer}>
            <Image source={assets[4]} />
          </View>
          <Text style={styles.travelingTime}>
            {calculateTravellingTime(
              data.departure_time,
              data.departure_day,
              data.arrival_time,
              data.arrival_day
            )}
          </Text>
        </View>
        <View style={styles.iconsRow}>
          <Image style={{ marginHorizontal: 1 }} source={assets[3]} />
          <Image style={{ marginHorizontal: 1 }} source={assets[1]} />
          <Image style={{ marginHorizontal: 1 }} source={assets[2]} />
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price} numberOfLines={2}>
            {formatPrice(totalPrice)} RSD
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    flexDirection: "column",
    borderRadius: 10,
    padding: height * 0.015,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5.46,
    elevation: 9,
    marginBottom: height * 0.02,
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: "#188DFD",
  },
  scheduleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.01,
  },
  time: {
    fontSize: height * 0.02,
    fontWeight: "bold",
    paddingTop: height * 0.01,
  },
  station: {
    fontWeight: "bold",
    paddingTop: height * 0.01,
    fontSize: height * 0.02,
  },
  arrow: {
    padding: height * 0.01,
    alignSelf: "center",
    justifyContent: "center",
  },
  separatorLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#ADADAD",
    marginVertical: height * 0.01,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.01,
  },
  infoContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  iconContainer: {
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.005,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#ADADAD",
  },
  iconsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: width * 0.05,
  },
  priceContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  price: {
    fontWeight: "bold",
    fontSize: height * 0.022,
    color: "#005b85",
  },
  travelingTime: {
    fontSize: height * 0.022,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: height * 0.01,
  },
});

export default PricesWithInfoCard;
