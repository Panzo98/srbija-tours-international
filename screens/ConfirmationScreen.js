import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomScreenHeader from "../components/CustomScreenHeader";
import { useDispatch, useSelector } from "react-redux";
import QRCode from "react-native-qrcode-svg";
import { useAssets } from "expo-asset";
import { formatPrice } from "../utils/formatPrice";
import Carousel from "react-native-reanimated-carousel";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const ConfirmationScreen = ({ navigation }) => {
  const searchQuery = useSelector((state) => state.searchReducer);
  const { passengersFullInfo } = searchQuery;
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [assets] = useAssets([require("../assets/icons/arrow-down.png")]);

  useFocusEffect(
    React.useCallback(() => {
      setCurrentStep(0);
    }, [])
  );

  const formatCategoryToDisplay = (category) => {
    switch (category) {
      case 1:
        return "Odrasli 26-60";
      case 2:
        return "Bebe 0-2";
      case 3:
        return "Deca 3-12";
      case 4:
        return "Mladi 13-26";
      case 5:
        return "Senior 60+";
      default:
        return "Pogrešna kategorija";
    }
  };

  if (!assets) {
    return (
      <View>
        <Text>Učitavanje</Text>
      </View>
    );
  }

  const handleFinish = () => {
    dispatch({ type: "RESET_REDUCER" });
    dispatch({ type: "RESET_PASSENGERS_INFO" });
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    );
  };

  const renderItem = ({ item: passenger }) => (
    <View style={styles.cardContainer}>
      <View style={styles.dataContainer}>
        <Text style={styles.title}>Pregled porudžbine</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            Ime: <Text style={styles.boldText}>{passenger.name}</Text>
          </Text>
          <Text style={styles.label}>
            Prezime: <Text style={styles.boldText}>{passenger.lastName}</Text>
          </Text>
          <Text style={styles.label}>
            Kategorija:{" "}
            <Text style={styles.boldText}>
              {formatCategoryToDisplay(passenger.category)}
            </Text>
          </Text>
          <Text style={styles.label}>
            Cena:{" "}
            <Text style={styles.boldText}>
              {formatPrice(passenger.price)} RSD
            </Text>
          </Text>
          <Text style={styles.label}>
            Datum rođenja:{" "}
            <Text style={styles.boldText}>{passenger.birthday}</Text>
          </Text>
        </View>

        <View style={styles.scheduleContainer}>
          <View>
            <Text style={styles.time}>Datum polaska</Text>
            <Text style={styles.time}>{searchQuery.departureDate}</Text>
          </View>
          <Image source={assets[0]} style={styles.arrow} />
          <View>
            <Text style={styles.station}>
              AS {searchQuery?.departure?.value}
            </Text>
            <Text style={styles.station}>
              AS {searchQuery?.destination?.value}
            </Text>
          </View>
        </View>

        <View style={styles.separatorLine}></View>

        <View style={styles.qrCodeContainer}>
          <QRCode
            value={passenger.qrCode}
            size={screenWidth * 0.3}
            style={styles.qrCode}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <CustomScreenHeader title={"Porudžbina"} navigation={navigation} />
        <View style={styles.carouselWrapper}>
          <Carousel
            loop={false}
            width={screenWidth}
            height={screenHeight * 0.75} // Adjusted to fit above the button
            data={passengersFullInfo}
            renderItem={renderItem}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOpacity: 0.7,
              parallaxAdjacentItemScale: 0.8,
            }}
            onSnapToItem={(index) => setCurrentStep(index)}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.navButton} onPress={handleFinish}>
            <Text style={styles.navButtonText}>ZAVRŠI</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  carouselWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderRadius: 10,
    backgroundColor: "white",
    marginHorizontal: screenWidth * 0.025,
  },
  dataContainer: {
    padding: screenWidth * 0.05,
  },
  title: {
    fontSize: screenHeight * 0.025,
    fontWeight: "bold",
    marginBottom: screenHeight * 0.01,
  },
  infoContainer: {
    marginBottom: screenHeight * 0.005,
  },
  label: {
    fontSize: screenHeight * 0.022,
    fontWeight: "300",
    marginBottom: screenHeight * 0.003,
  },
  boldText: {
    fontWeight: "bold",
  },
  scheduleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: screenHeight * 0.01,
  },
  time: {
    fontSize: screenHeight * 0.02,
    fontWeight: "bold",
    paddingTop: screenHeight * 0.01,
  },
  station: {
    fontWeight: "bold",
    paddingTop: screenHeight * 0.01,
    fontSize: screenHeight * 0.02,
  },
  arrow: {
    alignItems: "center",
    marginTop: screenHeight * 0.01,
    justifyContent: "center",
  },
  qrCodeContainer: {
    alignItems: "center",
    marginBottom: screenHeight * 0.01,
    marginTop: screenHeight * 0.01,
  },
  separatorLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#ADADAD",
    marginVertical: screenHeight * 0.01,
  },
  buttonContainer: {
    padding: screenWidth * 0.04,
    marginBottom: screenHeight * 0.02,
  },
  navButton: {
    backgroundColor: "#188dfd",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    height: screenHeight * 0.07,
  },
  navButtonText: {
    color: "white",
    fontSize: screenHeight * 0.02,
    fontWeight: "bold",
  },
});

export default ConfirmationScreen;
