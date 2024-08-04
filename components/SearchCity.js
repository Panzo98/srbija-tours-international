import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { Feather, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import ModalHeader from "./ModalHeader";
import { useDispatch } from "react-redux";
import { getCountry } from "../utils/getCountry";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useFocusEffect, useRoute } from "@react-navigation/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const SearchCity = ({ data, slideDown, modalName, type }) => {
  const [searchText, setSearchText] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const dispatch = useDispatch();
  const animatedHeight = useRef(new Animated.Value(screenHeight * 0.3)).current;
  const route = useRoute();

  useFocusEffect(
    React.useCallback(() => {
      setFilteredCities([]);
      setSearchText("");
      if (route.name === "Home") {
        StatusBar.setBackgroundColor("#93b6d1");
        StatusBar.setTranslucent(true);
      } else {
        StatusBar.setBackgroundColor("#188DFD");
        StatusBar.setTranslucent(false);
      }
    }, [route.name])
  );

  useEffect(() => {
    setFilteredCities([]);
    setSearchText("");
  }, [modalName, type]);

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredData = data.filter((item) =>
      (item.value || item.name).toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCities(filteredData);
  };

  const clearSearch = () => {
    Animated.timing(animatedHeight, {
      toValue: screenHeight * 0.3,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setSearchText("");
      setFilteredCities([]);
    });
  };

  const selectCity = (cityDetails) => {
    if (type === "departure") {
      dispatch({
        type: "SET_DEPARTURE",
        payload: { id: cityDetails.key, value: cityDetails.value },
      });
    } else if (type === "destination") {
      dispatch({
        type: "SET_DESTINATION",
        payload: { id: cityDetails.id_city, value: cityDetails.name },
      });
    }
    setSearchText("");
    setFilteredCities([]);
    slideDown();
  };

  useEffect(() => {
    const maxHeight = screenHeight * 0.6; // Increased height to display at least 3 cities
    const itemHeight = screenHeight * 0.1; // Height of one city item
    const height =
      Math.min(filteredCities.length * itemHeight, maxHeight) ||
      screenHeight * 0.3;

    Animated.timing(animatedHeight, {
      toValue: height,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [filteredCities]);

  return (
    <View style={styles.container}>
      <ExpoStatusBar backgroundColor="#188dfd" style="light" />

      <ModalHeader modalName={modalName} slideDown={slideDown} />
      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={screenHeight * 0.025}
          color="#999"
          style={{ marginRight: 5 }}
        />
        <TextInput
          placeholder="Unesite naziv grada"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={handleSearch}
          style={styles.input}
          autoFocus={true}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={{ marginLeft: 5 }}>
            <AntDesign
              name="close"
              size={screenHeight * 0.025}
              color="#757575"
            />
          </TouchableOpacity>
        )}
      </View>
      {searchText.length >= 2 && (
        <Animated.View
          style={[styles.resultsContainer, { height: animatedHeight }]}
        >
          <ScrollView
            showsVerticalScrollIndicator={true}
            persistentScrollbar={true}
          >
            {filteredCities.length > 0 ? (
              filteredCities.map((item) => (
                <TouchableOpacity
                  key={item.key || item.id_city}
                  onPress={() => selectCity(item)}
                  style={styles.cityItem}
                >
                  <MaterialCommunityIcons
                    name="city-variant"
                    size={24}
                    color={"#999"}
                  />
                  <View style={styles.cityTextContainer}>
                    <Text style={styles.cityText}>
                      {item.value || item.name}
                    </Text>
                    <Text style={styles.countryText}>
                      {getCountry(item.value || item.name)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>Nema rezultata</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: screenWidth * 0.04,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#999",
    borderWidth: 1,
    borderRadius: 10,
    padding: screenHeight * 0.015,
    marginBottom: screenHeight * 0.02,
  },
  input: {
    flex: 1,
    fontSize: screenHeight * 0.022,
  },
  resultsContainer: {
    maxHeight: screenHeight * 0.6,
  },
  cityItem: {
    padding: screenHeight * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
  },
  cityTextContainer: {
    marginLeft: screenWidth * 0.02,
  },
  cityText: {
    fontSize: screenHeight * 0.022,
  },
  countryText: {
    fontSize: screenHeight * 0.018,
    color: "#999",
  },
  noResults: {
    alignItems: "center",
    justifyContent: "center",
    padding: screenHeight * 0.02,
    height: screenHeight * 0.3,
  },
  noResultsText: {
    fontSize: screenHeight * 0.022,
    color: "#999",
  },
});

export default SearchCity;
