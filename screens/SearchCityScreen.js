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
} from "react-native";
import { Feather, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { getCountry } from "../utils/getCountry";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const SearchCityScreen = ({ route, navigation }) => {
  const { data, modalName, type } = route.params;
  const [searchText, setSearchText] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const dispatch = useDispatch();
  const animatedHeight = useRef(new Animated.Value(screenHeight * 0.3)).current;
  const searchInputRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      setSearchText("");
      setFilteredCities([]);
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [])
  );

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length < 2) {
      setFilteredCities([]);
    } else if (data) {
      const filteredData = data.filter((item) =>
        (item.value || item.name).toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCities(filteredData);
    }
  };

  const clearSearch = () => {
    Animated.timing(animatedHeight, {
      toValue: screenHeight * 0.3,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setSearchText("");
      setFilteredCities([]);
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
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
    navigation.goBack();
  };

  useEffect(() => {
    const maxHeight = screenHeight * 0.6;
    const itemHeight = screenHeight * 0.1;
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack}>
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{modalName}</Text>
        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={screenHeight * 0.025}
            color="#999"
            style={{ marginRight: 5 }}
          />
          <TextInput
            ref={searchInputRef}
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
                color="#999"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.container}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#188DFD",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#188DFD",
    padding: 16,
    paddingBottom: 32,
  },
  headerTitle: {
    fontSize: screenWidth * 0.07,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 8,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    fontSize: screenWidth * 0.05,
    color: "#000",
  },
  resultsContainer: {
    maxHeight: screenHeight * 0.6,
    backgroundColor: "#fff",
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
    fontSize: screenWidth * 0.045,
    color: "#000",
  },
  countryText: {
    fontSize: screenWidth * 0.04,
    color: "#999",
  },
  noResults: {
    alignItems: "center",
    justifyContent: "center",
    padding: screenHeight * 0.02,
    height: screenHeight * 0.3,
  },
  noResultsText: {
    fontSize: screenWidth * 0.045,
    color: "#999",
  },
});

export default SearchCityScreen;
