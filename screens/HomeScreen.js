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
} from "react-native";
import { useAssets } from "expo-asset";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "../components/CustomModal";
import { Ionicons } from "@expo/vector-icons";
import { useFetchActions } from "../hooks/useFetchActions";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [departureDates, setDepartureDates] = useState("");
  const [returnDates, setReturnDates] = useState("");
  const [cities, setCities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [tripType, setTripType] = useState("one-way");
  const dispatch = useDispatch();

  const {
    fetchAllCities,
    fetchDestinationCities,
    fetchDatesBetweenCities,
    fetchDatesForRouteOnDate,
  } = useFetchActions();

  const searchQuery = useSelector((state) => state.searchReducer);
  const passengers = useSelector((state) => state.searchReducer.passengers);
  const isConnected = useSelector((state) => state.connectionReducer.connected);
  const finalPassengersCount = passengers.reduce((total, passenger) => {
    return total + passenger.count;
  }, 0);
  const [assets] = useAssets([require("../assets/images/bus.png")]);

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
      setCities("");
      dispatch({ type: "REMOVE_DEPARTURE" });
      dispatch({ type: "REMOVE_DESTINATION" });
      dispatch({ type: "REMOVE_DEPARTURE_DATE" });
      dispatch({ type: "REMOVE_RETURN_DATE" });
      dispatch({ type: "DESELECT_LINE" });
      dispatch({ type: "RESET_PASSENGERS_INFO" });
      dispatch({ type: "RESET_RESERVATIONS_IDS" });
      dispatch({ type: "RESET_PASSENGERS_COUNT" });
      const loadCities = async () => {
        const citiesData = await fetchAllCities();
        setCities(citiesData);
      };
      loadCities();
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
        dispatch({ type: "RESET_PASSENGERS_INFO" });
        dispatch({ type: "RESET_RESERVATIONS_IDS" });
        dispatch({ type: "RESET_PASSENGERS_COUNT" });

        const citiesData = await fetchDestinationCities(
          searchQuery.departure.id
        );
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
        dispatch({ type: "RESET_PASSENGERS_INFO" });
        dispatch({ type: "RESET_RESERVATIONS_IDS" });
        dispatch({ type: "RESET_PASSENGERS_COUNT" });

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

  useEffect(() => {
    try {
      const loadReturnDates = async () => {
        if (!searchQuery.departureDate) return;
        setReturnDates("");
        dispatch({ type: "REMOVE_RETURN_DATE" });
        dispatch({ type: "DESELECT_LINE" });
        dispatch({ type: "RESET_PASSENGERS_INFO" });
        dispatch({ type: "RESET_RESERVATIONS_IDS" });
        dispatch({ type: "RESET_PASSENGERS_COUNT" });

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
      finalPassengersCount > 0
    ) {
      return navigation.navigate("ChooseLineScreen");
    } else {
      Alert.alert("Molimo popunite sva polja!");
    }
  };

  const formatPassengers = (passengers) => {
    const filteredPassengers = passengers.filter(
      (passenger) => passenger.count > 0
    );
    return filteredPassengers
      .map((passenger) => `${passenger.shortLabel} ${passenger.count}`)
      .join(", ");
  };

  if (!assets) {
    return (
      <View>
        <Text>Učitavanje</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {isConnected ? (
        <ScrollView contentContainerStyle={styles.container}>
          <CustomModal modalInfo={modalInfo} setModalInfo={setModalInfo} />
          <Image source={assets[0]} style={styles.image} />
          <View style={styles.inputContainer}>
            <Image source={require("../assets/images/company-logo.png")} />
            <Text style={styles.title}>Vaša veza sa Evropom</Text>
            <View style={styles.tripTypeContainer}>
              <TouchableOpacity
                onPress={() => setTripType("one-way")}
                style={[
                  styles.tripTypeButton,
                  tripType === "one-way" && styles.selectedTripTypeButton,
                ]}
              >
                <Text
                  style={[
                    styles.tripTypeText,
                    tripType === "one-way" && styles.selectedTripTypeText,
                  ]}
                >
                  Jednosmjerna
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTripType("round-trip")}
                style={[
                  styles.tripTypeButton,
                  tripType === "round-trip" && styles.selectedTripTypeButton,
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
                  searchQuery?.departure.id
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
                    data: searchQuery.passengers,
                    modalName: "Kategorije putnika",
                  })
                }
                style={styles.inputPicker}
              >
                <Text style={styles.inputLabel}>Putnici</Text>
                <Text style={styles.inputValue}>
                  {formatPassengers(searchQuery.passengers)}
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
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
  },
  image: {
    width: "100%",
    height: height * 0.25,
    resizeMode: "cover",
  },
  inputContainer: {
    marginTop: -20,
    backgroundColor: "white",
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
    marginBottom: height * 0.03,
  },
  tripTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    marginHorizontal: 5,
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
    marginBottom: height * 0.015,
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
