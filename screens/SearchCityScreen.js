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
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
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
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    });
  };

  const selectCity = (cityDetails) => {
    Keyboard.dismiss();
    if (type === "departure") {
      dispatch({
        type: "SET_DEPARTURE",
        payload: { id: cityDetails.key, value: cityDetails.value },
      });
    } else if (type === "destination") {
      dispatch({
        type: "SET_DESTINATION",
        payload: { id: cityDetails.key, value: cityDetails.value },
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

  const handleCityPress = (cityDetails) => {
    Keyboard.dismiss();
    setTimeout(() => {
      selectCity(cityDetails);
    }, 50);
  };

  return (
    <View style={styles.safeAreaWrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#188DFD" />
      <SafeAreaView style={styles.safeArea} edges={["left", "right", "top"]}>
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            {searchText.length > 0 && (
              <Animated.View
                style={[styles.resultsContainer, { height: animatedHeight }]}
              >
                <ScrollView
                  showsVerticalScrollIndicator={true}
                  persistentScrollbar={true}
                  keyboardShouldPersistTaps="always"
                >
                  {filteredCities.length > 0 ? (
                    filteredCities.map((item) => (
                      <CityItem
                        key={item.key || item.id_city}
                        item={item}
                        onPress={() => handleCityPress(item)}
                      />
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
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </View>
  );
};

const CityItem = ({ item, onPress }) => {
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: screenHeight * 0.1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <Animated.View style={{ height: heightAnim, overflow: "hidden" }}>
      <TouchableOpacity onPress={onPress} style={styles.cityItem}>
        <MaterialCommunityIcons name="city-variant" size={24} color={"#999"} />
        <View style={styles.cityTextContainer}>
          <Text style={styles.cityText}>{item.value || item.name}</Text>
          <Text style={styles.countryText}>
            {getCountry(item.value || item.name)}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  safeAreaWrapper: {
    flex: 1,
    backgroundColor: "#188DFD",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#188DFD",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F4F4",
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
    // backgroundColor: "#fff",
  },
  cityItem: {
    padding: screenHeight * 0.02,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
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
