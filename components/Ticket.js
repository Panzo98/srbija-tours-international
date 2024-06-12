import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Alert,
  Dimensions,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { formatPrice } from "../utils/formatPrice";
import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get("window");

const Ticket = ({ ticket, activeTab, loadStoredTickets, onToggleExpand }) => {
  const [heightAnim] = useState(new Animated.Value(0));
  const [selected, setSelected] = useState(false);
  const [commentHeight, setCommentHeight] = useState(0);

  useEffect(() => {
    const baseHeight = ticket.direction === 2 ? 240 : 200;
    const targetHeight = selected ? baseHeight + commentHeight : 0;
    Animated.timing(heightAnim, {
      toValue: targetHeight,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [selected, ticket.direction, commentHeight]);

  useEffect(() => {
    calculateCommentHeight(ticket.comment);
  }, [ticket.comment]);

  const calculateCommentHeight = (comment) => {
    if (!comment) {
      setCommentHeight(0);
      return;
    }

    const lineHeight = 18;
    const maxCharsPerLine = Math.floor((width - 40) / 10);
    const numLines = Math.ceil(comment.length / maxCharsPerLine);
    const calculatedHeight = numLines * lineHeight;

    setCommentHeight(calculatedHeight);
  };

  const getDirectionText = (direction) => {
    return direction === 1 ? "Jednosmjerna" : "Povratna";
  };

  const getUsageCountText = (usageCount) => {
    return usageCount > 0 ? "Iskorištena" : "Neiskorištena";
  };

  const capitalizeFirstLetter = (sentence) => {
    if (!sentence) return sentence;
    return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
  };

  const handleDownload = async () => {
    try {
      const storedTickets = await SecureStore.getItemAsync("tickets");
      const tickets = storedTickets ? JSON.parse(storedTickets) : [];

      const ticketExists = tickets.some((t) => t.id_res === ticket.id_res);
      if (ticketExists) {
        Alert.alert("Info", "Karta je već preuzeta.");
        return;
      }

      tickets.push(ticket);
      await SecureStore.setItemAsync("tickets", JSON.stringify(tickets));
      Alert.alert("Success", "Karta je preuzeta.");
      loadStoredTickets();
    } catch (error) {
      Alert.alert("Error", "Došlo je do greške prilikom preuzimanja karte.");
      console.error("Error saving ticket:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const storedTickets = await SecureStore.getItemAsync("tickets");
      let tickets = storedTickets ? JSON.parse(storedTickets) : [];

      tickets = tickets.filter((t) => t.id_res !== ticket.id_res);

      await SecureStore.setItemAsync("tickets", JSON.stringify(tickets));
      Alert.alert("Success", "Karta je izbrisana iz preuzetih.");
      loadStoredTickets();
    } catch (error) {
      Alert.alert("Error", "Došlo je do greške prilikom brisanja karte.");
      console.error("Error deleting ticket:", error);
    }
  };

  const handleView = () => {};

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={[styles.container]}
        onPress={() => {
          onToggleExpand(ticket.id_res);
          setSelected(!selected);
        }}
      >
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
            <Text style={[styles.additionalInfo, styles.comment]}>
              Komentar: {ticket.comment || "Bez komentara"}
            </Text>
            <Text style={styles.additionalInfo}>
              Od: {capitalizeFirstLetter(ticket.from_city)}
            </Text>
            <Text style={styles.additionalInfo}>
              Do: {capitalizeFirstLetter(ticket.to_city)}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleView}>
                <Text style={styles.buttonText}>Pregled karte</Text>
              </TouchableOpacity>
              {activeTab === "all" && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleDownload}
                >
                  <Text style={styles.buttonText}>Preuzmi kartu</Text>
                </TouchableOpacity>
              )}
              {activeTab === "stored" && (
                <TouchableOpacity style={styles.button} onPress={handleDelete}>
                  <Text style={styles.buttonText}>Izbriši iz preuzetih</Text>
                </TouchableOpacity>
              )}
              {ticket.direction === 2 && (
                <TouchableOpacity
                  style={[styles.button, styles.disabledButton]}
                  disabled={true}
                >
                  <Text style={styles.buttonText}>Rezerviši povratnu</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
  },
  qrContainer: {},
  reservationNumber: {
    marginTop: 5,
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  detailsContainer: {
    paddingVertical: 5,
    marginLeft: 10,
    flex: 1,
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
  comment: {
    maxWidth: "100%",
    flexWrap: "wrap",
  },
  animatedContainer: {
    overflow: "hidden",
  },
  buttonContainer: {
    flexDirection: "column",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#188DFD",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 3,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "gray",
  },
});

export default Ticket;
