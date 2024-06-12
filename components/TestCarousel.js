import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const TestCarousel = () => {
  const data = [{ text: "Slide 1" }, { text: "Slide 2" }, { text: "Slide 3" }];

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Text style={styles.cardText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        loop={false}
        width={screenWidth}
        height={screenHeight * 0.75}
        data={data}
        renderItem={renderItem}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOpacity: 0.7,
          parallaxAdjacentItemScale: 0.8,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightblue",
    borderRadius: 10,
    height: "100%",
    marginHorizontal: screenWidth * 0.025,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default TestCarousel;
