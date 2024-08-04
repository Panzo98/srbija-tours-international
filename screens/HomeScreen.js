import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { useAssets } from "expo-asset";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "../components/CustomModal";
import { Ionicons } from "@expo/vector-icons";
import { useFetchActions } from "../hooks/useFetchActions";
import allCities, { getCitiesByCountry } from "../utils/allCities";
import passengerTypes from "../utils/passengerTypes";
import { homepageBus } from "../assets/icons/homepageBus.js";
import Constants from "expo-constants";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useRoute, useFocusEffect } from "@react-navigation/native";

// import getDestinations from "../utils/getDestinations";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [departureDates, setDepartureDates] = useState("");
  const [returnDates, setReturnDates] = useState("");
  const [cities, setCities] = useState(allCities);
  const [destinations, setDestinations] = useState([]);
  const [tripType, setTripType] = useState("one-way");
  const route = useRoute();
  const dispatch = useDispatch();

  const { fetchDatesBetweenCities, fetchDatesForRouteOnDate } =
    useFetchActions();

  const searchQuery = useSelector((state) => state.searchReducer);
  const passengersForBackend = useSelector(
    (state) => state.searchReducer.passengersForBackend
  );
  const isConnected = useSelector((state) => state.connectionReducer.connected);
  const mainImage = require("../assets/images/bus.png");

  const placeholderImage = homepageBus;

  const [modalInfo, setModalInfo] = useState({
    isVisible: false,
    type: null,
    data: null,
    setData: null,
    modalName: null,
  });

  const normalizeDate = (date) => {
    if (!date) return null;
    return date
      .split("-")
      .map((part, index) => {
        return index > 0 && part.length === 1 ? "0" + part : part;
      })
      .join("-");
  };

  useEffect(() => {
    try {
      dispatch({ type: "REMOVE_DEPARTURE" });
      dispatch({ type: "REMOVE_DESTINATION" });
      dispatch({ type: "REMOVE_DEPARTURE_DATE" });
      dispatch({ type: "REMOVE_RETURN_DATE" });
      dispatch({ type: "DESELECT_LINE" });
      dispatch({ type: "RESET_PASSENGERS_FOR_BACKEND" });
      dispatch({ type: "RESET_RESERVATIONS_IDS" });
      setCities(allCities);
      console.log("fetchAllCities() done");
    } catch (error) {
      console.log("fetchAllCities() error");
    }
  }, []);

  useEffect(() => {
    try {
      const loadDestCities = async () => {
        if (!searchQuery.departure || !searchQuery.departure.id) return;
        setDepartureDates("");
        setReturnDates("");
        dispatch({ type: "REMOVE_DESTINATION" });
        dispatch({ type: "REMOVE_DEPARTURE_DATE" });
        dispatch({ type: "REMOVE_RETURN_DATE" });
        dispatch({ type: "DESELECT_LINE" });
        dispatch({ type: "RESET_RESERVATIONS_IDS" });
        dispatch({ type: "RESET_PASSENGERS_FOR_BACKEND" });

        const citiesData = await getCitiesByCountry(searchQuery.departure.id);
        setDestinations(citiesData);
        console.log("fetchDestinationCities() done");
      };
      loadDestCities();
    } catch (error) {
      console.log("fetchDestinationCities() error");
    }
  }, [searchQuery.departure.id]);

  useEffect(() => {
    try {
      const loadDates = async () => {
        if (!searchQuery.destination || !searchQuery.destination.id) return;
        setDepartureDates("");
        setReturnDates("");
        dispatch({ type: "REMOVE_DEPARTURE_DATE" });
        dispatch({ type: "REMOVE_RETURN_DATE" });
        dispatch({ type: "DESELECT_LINE" });
        dispatch({ type: "RESET_RESERVATIONS_IDS" });
        dispatch({ type: "RESET_PASSENGERS_FOR_BACKEND" });

        const tempDepartureDates = await fetchDatesBetweenCities(
          searchQuery.departure.id,
          searchQuery.destination.id
        );
        const enabledDates = tempDepartureDates.reduce((acc, date) => {
          const normalizedDate = normalizeDate(date);
          acc[normalizedDate] = { disabled: false };
          return acc;
        }, {});
        console.log("fetchDatesBetweenCities() done");
        setDepartureDates(enabledDates);
      };
      loadDates();
    } catch (error) {
      console.log("fetchDatesBetweenCities() error");
    }
  }, [searchQuery.destination]);

  useFocusEffect(
    React.useCallback(() => {
      if (route.name === "Home") {
        StatusBar.setBackgroundColor("#93b6d1");
        StatusBar.setTranslucent(true);
      } else {
        StatusBar.setBackgroundColor("#188DFD");
        StatusBar.setTranslucent(false);
      }
    }, [route])
  );

  useEffect(() => {
    try {
      const loadReturnDates = async () => {
        if (!searchQuery.departureDate) return;
        setReturnDates("");
        dispatch({ type: "REMOVE_RETURN_DATE" });
        dispatch({ type: "DESELECT_LINE" });
        dispatch({ type: "RESET_RESERVATIONS_IDS" });
        dispatch({ type: "RESET_PASSENGERS_FOR_BACKEND" });

        const tempReturnDates = await fetchDatesForRouteOnDate(
          searchQuery.departure.id,
          searchQuery.destination.id,
          searchQuery.departureDate
        );
        const enabledDates = tempReturnDates.reduce((acc, date) => {
          const normalizedDate = normalizeDate(date);
          acc[normalizedDate] = { disabled: false };
          return acc;
        }, {});
        console.log("fetchDatesForRouteOnDate() done");
        setReturnDates(enabledDates);
      };
      loadReturnDates();
    } catch (error) {
      console.log("fetchDatesForRouteOnDate() error");
    }
  }, [searchQuery.departureDate]);

  const handleSearch = async () => {
    if (
      searchQuery.departure.id &&
      searchQuery.destination.id &&
      searchQuery.departureDate &&
      passengersForBackend.length > 0 &&
      (searchQuery.direction === 1 ||
        (searchQuery.direction === 2 && searchQuery.returnDate))
    ) {
      dispatch({ type: "RESET_PASSENGERS_INFO" });
      return navigation.navigate("ChooseLineScreen");
    } else {
      Alert.alert("Molimo popunite sva polja!");
    }
  };

  const handleTripTypeChange = (type) => {
    setTripType(type);
    const direction = type === "one-way" ? 1 : 2;
    dispatch({ type: "SET_DIRECTION", payload: direction });
  };

  const countPassengers = (categoryIds) => {
    const passengerCounts = {};

    categoryIds.forEach((id) => {
      if (passengerCounts[id]) {
        passengerCounts[id]++;
      } else {
        passengerCounts[id] = 1;
      }
    });

    const result = passengerTypes
      .map((type) => {
        if (passengerCounts[type.categoryId]) {
          return `${type.shortLabel} ${passengerCounts[type.categoryId]}`;
        }
        return null;
      })
      .filter(Boolean)
      .join(", ");

    return result;
  };
  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
      <ExpoStatusBar backgroundColor="#93b6d1" style="light" />
      {isConnected ? (
        <ScrollView contentContainerStyle={styles.container}>
          <CustomModal modalInfo={modalInfo} setModalInfo={setModalInfo} />
          <View style={styles.imageWrapper}>
            <Image
              source={mainImage}
              defaultSource={{ uri: placeholderImage }}
              style={styles.image}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.title}>Vaša veza sa Evropom</Text>
            <View style={styles.tripTypeContainer}>
              <TouchableOpacity
                onPress={() => handleTripTypeChange("one-way")}
                style={[
                  styles.tripTypeButton,
                  tripType === "one-way" && styles.selectedTripTypeButton,
                  {
                    marginRight: 5,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tripTypeText,
                    tripType === "one-way" && styles.selectedTripTypeText,
                  ]}
                >
                  Jednosmerna
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleTripTypeChange("round-trip")}
                style={[
                  styles.tripTypeButton,
                  tripType === "round-trip" && styles.selectedTripTypeButton,
                  { marginLeft: 5 },
                ]}
              >
                <Text
                  style={[
                    styles.tripTypeText,
                    tripType === "round-trip" && styles.selectedTripTypeText,
                  ]}
                >
                  Povratna
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputPickerWrapper}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("SearchCityScreen", {
                    data: cities,
                    modalName: "Početna stanica",
                    type: "departure",
                  })
                }
                style={styles.inputPicker}
              >
                <Text style={styles.inputLabel}>Od</Text>
                <Text style={styles.inputValue}>
                  {searchQuery?.departure?.value}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputPickerWrapper}>
              <TouchableOpacity
                onPress={() =>
                  searchQuery?.departure?.id
                    ? navigation.navigate("SearchCityScreen", {
                        data: destinations,
                        modalName: "Destinacija",
                        type: "destination",
                      })
                    : Alert.alert(
                        "Greška",
                        "Nije moguće izabrati destinaciju bez da izaberete početni grad!"
                      )
                }
                style={styles.inputPicker}
              >
                <Text style={styles.inputLabel}>Do</Text>
                <Text style={styles.inputValue}>
                  {searchQuery.destination?.value}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={
                tripType === "one-way"
                  ? styles.fullWidthPicker
                  : styles.colWrapper
              }
            >
              <TouchableOpacity
                onPress={() =>
                  searchQuery.departure.id && searchQuery.destination.id
                    ? setModalInfo({
                        isVisible: true,
                        type: "date",
                        data: departureDates,
                        modalName: "Polasci",
                      })
                    : Alert.alert(
                        "Greška",
                        "Nije moguće izabrati datum polaska bez da izaberete početni grad i destinaciju!"
                      )
                }
                style={
                  tripType === "one-way"
                    ? styles.fullDatePicker
                    : styles.datePicker
                }
              >
                <Text style={styles.inputLabel}>Polazak</Text>
                <Text style={styles.inputValue}>
                  {searchQuery.departureDate}
                </Text>
              </TouchableOpacity>
              {tripType === "round-trip" && (
                <TouchableOpacity
                  onPress={() => {
                    searchQuery.departure.id &&
                    searchQuery.destination.id &&
                    searchQuery.departureDate
                      ? setModalInfo({
                          isVisible: true,
                          type: "date",
                          data: returnDates,
                          modalName: "Dolasci",
                        })
                      : Alert.alert(
                          "Greška",
                          "Nije moguće izabrati datum povratka bez da izaberete početni grad, destinaciju i datum polaska!"
                        );
                  }}
                  style={styles.datePicker}
                >
                  <Text style={styles.inputLabel}>Povratak</Text>
                  <Text style={styles.inputValue}>
                    {searchQuery.returnDate || ""}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View
              style={[
                styles.inputPickerWrapper,
                tripType === "one-way" && { marginBottom: 0 },
              ]}
            >
              <TouchableOpacity
                onPress={() =>
                  setModalInfo({
                    isVisible: true,
                    type: "passengers",
                    data: passengerTypes,
                    modalName: "Kategorije putnika",
                  })
                }
                style={styles.inputPicker}
              >
                <Text style={styles.inputLabel}>Putnici</Text>
                <Text style={styles.inputValue}>
                  {countPassengers(passengersForBackend)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.offlineContainer}>
          <Ionicons name="cloud-offline-outline" size={100} color="#188DFD" />
          <Text style={styles.offlineText}>Trenutno ste offline</Text>
          <Text style={styles.offlineSubText}>
            Molimo vas da se povežete na internet kako biste mogli koristiti ovu
            uslugu.
          </Text>
        </View>
      )}
      {isConnected && (
        <View
          style={{
            paddingHorizontal: width * 0.04,
          }}
        >
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>PRETRAŽITE</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F4F4",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F4F4",
  },
  imageWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.25,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  inputContainer: {
    marginTop: height * 0.25 - 20,
    backgroundColor: "#F5F4F4",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.03,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: height * 0.03,
    textAlign: "center",
  },
  tripTypeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: height * 0.01,
  },
  tripTypeButton: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTripTypeButton: {
    backgroundColor: "#188DFD",
    borderColor: "#188DFD",
  },
  tripTypeText: {
    fontSize: height * 0.02,
  },
  selectedTripTypeText: {
    color: "white",
  },
  inputPickerWrapper: {
    width: "100%",
    height: height * 0.08,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    borderColor: "black",
    marginBottom: height * 0.01,
  },
  inputPicker: {
    width: "100%",
    height: "100%",
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  inputLabel: {
    fontSize: height * 0.02,
    color: "#999",
  },
  inputValue: {
    fontSize: height * 0.02,
  },
  colWrapper: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  datePicker: {
    width: "48%",
    marginBottom: height * 0.015,
    borderWidth: 1,
    padding: 10,
    height: height * 0.08,
    borderRadius: 5,
    justifyContent: "center",
    borderColor: "black",
  },
  fullWidthPicker: {
    width: "100%",
    marginBottom: height * 0.015,
  },
  fullDatePicker: {
    width: "100%",
    borderWidth: 1,
    padding: 10,
    height: height * 0.08,
    borderRadius: 5,
    justifyContent: "center",
    borderColor: "black",
  },
  searchBtn: {
    backgroundColor: "#188DFD",
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.07,
    borderRadius: 5,
    marginBottom: height * 0.03,
  },
  searchBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  offlineContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.1,
  },
  offlineText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#188DFD",
    textAlign: "center",
    marginVertical: 20,
  },
  offlineSubText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});

export default HomeScreen;
