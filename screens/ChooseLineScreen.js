import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  BackHandler,
} from "react-native";
import CustomScreenHeader from "../components/CustomScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import { srLatn } from "date-fns/locale";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import PricesWithInfoCard from "../components/PricesWithInfoCard";
import { useFetchActions } from "../hooks/useFetchActions";

const { width, height } = Dimensions.get("window");

export default function ChooseLineScreen({ navigation }) {
  const [prices, setPrices] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const { fetchPriceForRoute, fetchPriceForRoundTrip } = useFetchActions();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    let formatted = format(date, "EEEE, do MMMM yyyy", { locale: srLatn });
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    formatted = formatted.replace(
      /(^|\s)([a-z])/gu,
      (match, p1, p2) => p1 + p2.toUpperCase()
    );
    return formatted;
  };

  function convertPassengers(passengers) {
    const passengerArray = [];
    passengers.forEach((passenger) => {
      for (let i = 0; i < passenger.count; i++) {
        passengerArray.push(passenger.categoryId);
      }
    });
    return passengerArray;
  }

  const searchQuery = useSelector((state) => state.searchReducer);

  const fetchPrices = async () => {
    try {
      let response;
      const passengers = convertPassengers(searchQuery.passengers);

      if (searchQuery.direction === 1 || !searchQuery.returnDate) {
        response = await fetchPriceForRoute(
          searchQuery.direction,
          searchQuery.departure.id,
          searchQuery.destination.id,
          searchQuery.departureDate,
          passengers
        );
      } else {
        response = await fetchPriceForRoundTrip(
          searchQuery.direction,
          searchQuery.departure.id,
          searchQuery.destination.id,
          searchQuery.departureDate,
          searchQuery.returnDate,
          passengers
        );
      }
      setPrices(response);
      dispatch({ type: "DISABLE_LOADING" });
    } catch (error) {
      console.log("fetchPriceForRoute() ERROR", error);
      dispatch({ type: "DISABLE_LOADING" });
    }
  };

  useFocusEffect(
    useCallback(() => {
      dispatch({ type: "SET_LOADING" });
      setSelectedLine(null);
      setPrices(null);
      fetchPrices();

      const onBackPress = () => {
        navigation.navigate("Home");
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [
      searchQuery.departure.id,
      searchQuery.destination.id,
      searchQuery.departureDate,
      searchQuery.returnDate,
      searchQuery.direction,
      searchQuery.passengers,
    ])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      navigation.navigate("Home");
    });

    return unsubscribe;
  }, [navigation]);

  const handleNext = () => {
    if (!selectedLine) {
      Alert.alert(
        "Upozorenje",
        "Molimo vas da izaberete liniju pre nego što nastavite."
      );
      return;
    }
    dispatch({
      type: "SELECT_LINE",
      payload: {
        id_departure: selectedLine.id_departure,
        total: selectedLine.totalPrice,
      },
    });
    dispatch({
      type: "UPDATE_PASSENGERS_INFO",
      payload: selectedLine.passCatPriceSr,
    });
    if (isAuthenticated) {
      navigation.navigate("PreOrderScreen");
    } else {
      navigation.navigate("EnterEmailScreen");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          <CustomScreenHeader
            title={`${searchQuery.departure.value} - ${searchQuery.destination.value}`}
            navigation={navigation}
          />
          <View style={styles.miniBanner}>
            <AntDesign name="calendar" size={height * 0.03} color="white" />
            <Text style={styles.miniBannerTxt}>
              {formatDate(searchQuery.departureDate)}
            </Text>
          </View>
          <View style={{ padding: width * 0.04 }}>
            {prices?.lineAndDeparture?.length > 0 ? (
              prices.lineAndDeparture.map((price, index) => (
                <PricesWithInfoCard
                  data={price}
                  key={index}
                  totalPrice={prices.total.total}
                  selectedLine={selectedLine}
                  setSelectedLine={setSelectedLine}
                  passCatPriceSr={prices.passCatPriceSr}
                />
              ))
            ) : (
              <View style={styles.noSeatsContainer}>
                {searchQuery?.loading ? null : (
                  <Text style={styles.noSeatsText}>Nema slobodnih mesta.</Text>
                )}
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedLine === null && styles.disabledButton,
          ]}
          onPress={handleNext}
          disabled={selectedLine === null}
        >
          <Text style={styles.buttonText}>DALJE</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  miniBannerTxt: {
    color: "white",
    fontSize: height * 0.025,
    fontWeight: "bold",
    paddingVertical: height * 0.003,
    marginLeft: width * 0.02,
  },
  miniBanner: {
    width: "100%",
    backgroundColor: "#005B85",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: height * 0.01,
  },
  nextButton: {
    backgroundColor: "#188DFD",
    borderRadius: 5,
    height: height * 0.07,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: width * 0.04,
    // marginBottom: height * 0.03,
    // marginBottom: height * 0.03,
  },
  disabledButton: {
    backgroundColor: "#B0C4DE",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  noSeatsContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: height * 0.05,
  },
  noSeatsText: {
    fontSize: height * 0.025,
    color: "#ff0000",
    textAlign: "center",
  },
});
