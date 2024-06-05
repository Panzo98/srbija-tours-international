import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomScreenHeader from "../components/CustomScreenHeader";
import { useSelector } from "react-redux";
import QRCode from "react-native-qrcode-svg";
import { useAssets } from "expo-asset";
import { formatPrice } from "../utils/formatPrice";
import Carousel, { Pagination } from "react-native-snap-carousel";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const ConfirmationScreen = ({ navigation }) => {
  const searchQuery = useSelector((state) => state.searchReducer);
  const { passengersFullInfo } = searchQuery;
  const [currentStep, setCurrentStep] = useState(0);
  const [assets] = useAssets([require("../assets/icons/arrow-down.png")]);

  const carouselRef = useRef(null);

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
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    );
  };

  const renderItem = ({ item: passenger, index }) => (
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

        {/* <Text style={styles.footerText}>Želimo Vam srećan put!</Text> */}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <CustomScreenHeader title={"Porudžbina"} />
        <View style={styles.carouselWrapper}>
          <Carousel
            ref={carouselRef}
            data={passengersFullInfo}
            renderItem={renderItem}
            sliderWidth={screenWidth}
            itemWidth={screenWidth * 0.8}
            inactiveSlideScale={0.9}
            inactiveSlideOpacity={0.7}
            inactiveSlideShift={10}
            contentContainerCustomStyle={styles.carouselContainer}
            onSnapToItem={(index) => setCurrentStep(index)}
            layout={"default"}
          />
          <Pagination
            dotsLength={passengersFullInfo.length}
            activeDotIndex={currentStep}
            containerStyle={styles.paginationContainer}
            dotStyle={styles.activeDot}
            inactiveDotStyle={styles.inactiveDot}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
        </View>

        <View style={styles.buttonContainer}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => {
                carouselRef.current.snapToPrev();
              }}
            >
              <Text style={styles.navButtonText}>PRETHODNI</Text>
            </TouchableOpacity>
          )}
          {currentStep < passengersFullInfo.length - 1 ? (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => {
                carouselRef.current.snapToNext();
              }}
            >
              <Text style={styles.navButtonText}>SLEDEĆI</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.navButton} onPress={handleFinish}>
              <Text style={styles.navButtonText}>ZAVRŠI</Text>
            </TouchableOpacity>
          )}
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
  },
  carouselWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: screenHeight * 0.02,
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
  message: {
    fontSize: screenHeight * 0.018,
    marginBottom: screenHeight * 0.02,
    marginTop: screenHeight * 0.015,
    backgroundColor: "#d9d9d9",
    padding: screenHeight * 0.025,
    fontWeight: "bold",
    textAlign: "justify",
  },
  qrCodeContainer: {
    alignItems: "center",
    marginBottom: screenHeight * 0.01,
    marginTop: screenHeight * 0.01,
  },
  footerText: {
    fontSize: screenHeight * 0.015,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: screenHeight * 0.02,
  },
  separatorLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#ADADAD",
    marginVertical: screenHeight * 0.01,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: screenWidth * 0.04,
    width: "100%",
    backgroundColor: "white",
  },
  navButton: {
    backgroundColor: "#188dfd",
    padding: screenHeight * 0.02,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: screenWidth * 0.02,
  },
  navButtonText: {
    color: "white",
    fontSize: screenHeight * 0.02,
    fontWeight: "bold",
  },
  paginationContainer: {
    paddingVertical: screenHeight * 0.01,
  },
  activeDot: {
    width: screenHeight * 0.012,
    height: screenHeight * 0.012,
    borderRadius: screenHeight * 0.006,
    backgroundColor: "#188dfd",
  },
  inactiveDot: {
    width: screenHeight * 0.012,
    height: screenHeight * 0.012,
    borderRadius: screenHeight * 0.006,
    backgroundColor: "#c4c4c4",
  },
  carouselContainer: {
    overflow: "visible",
  },
});

export default ConfirmationScreen;
