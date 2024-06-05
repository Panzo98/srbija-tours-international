import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { formatPrice } from "../utils/formatPrice";

const Ticket = ({ ticket, selectedLine }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [heightAnim] = useState(new Animated.Value(0));

  const handleSelect = () => {
    setExpanded(!expanded);
    Animated.timing(heightAnim, {
      toValue: expanded ? 0 : 200, // Adjust 200 to fit the expanded content height
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const getDirectionText = (direction) => {
    return direction === 1 ? "Jednosmjerna" : "Povratna";
  };

  const getUsageCountText = (usageCount) => {
    return usageCount > 0 ? "Iskorišćena" : "Neiskorišćena";
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={[styles.container]} onPress={handleSelect}>
        <View style={styles.qrContainer}>
          <QRCode
            value={`https://drivesoft-srbijatours.com/ticket/show?booking_number=${ticket.id_res}`}
            size={90}
          />
          <Text style={styles.reservationNumber}>#{ticket.id_res}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>
            {ticket.name} {ticket.lastname}
          </Text>
          <Text style={styles.date}>
            Datum: {new Date(ticket.created_at).toLocaleDateString()}
          </Text>
          <Text style={styles.email}>{ticket.email}</Text>
          <Text style={styles.telephone}>{ticket.telephone}</Text>
          <Text style={styles.price}>{formatPrice(ticket.rsd_price)} RSD</Text>
          <Animated.View
            style={[styles.animatedContainer, { height: heightAnim }]}
          >
            <Text style={styles.additionalInfo}>
              Tip karte: {getDirectionText(ticket.direction)}
            </Text>
            <Text style={styles.additionalInfo}>
              Status: {getUsageCountText(ticket.usage_count)}
            </Text>
            <Text style={styles.additionalInfo}>
              Komentar: {ticket.comment}
            </Text>
            <Text style={styles.additionalInfo}>Od: {ticket.from}</Text>
            <Text style={styles.additionalInfo}>Do: {ticket.to}</Text>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 10,
  },
  container: {
    backgroundColor: "white",
    width: "100%",
    flexDirection: "row",
    borderRadius: 10,
    // padding: 10,
    overflow: "hidden",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 1,
    //   height: 4,
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 5.46,
    // elevation: 9,
    // marginBottom: 15,
  },
  qrContainer: {},
  reservationNumber: {
    marginTop: 5,
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: "#188DFD",
  },
  detailsContainer: {
    paddingVertical: 5,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 14,
    color: "#777",
  },
  email: {
    fontSize: 14,
  },
  telephone: {
    fontSize: 14,
  },
  price: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#005b85",
  },
  additionalInfo: {
    fontSize: 14,
    color: "#777",
  },
  animatedContainer: {
    overflow: "hidden",
  },
  fadeOut: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
  },
});

export default Ticket;
