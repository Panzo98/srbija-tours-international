import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import CustomScreenHeader from "../components/CustomScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = ({ navigation }) => {
  const userFromRedux = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(userFromRedux);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userFromRedux) {
      setUser({
        ...userFromRedux,
        tickets: [
          {
            id: 1,
            date: "23.11.2023",
            from: "Sarajevo",
            destination: "Belgrade",
            inTwoWays: false,
          },
          {
            id: 2,
            date: "05.11.2023",
            from: "Belgrade",
            destination: "Zagreb",
            inTwoWays: false,
          },
          {
            id: 3,
            date: "11.11.2023",
            from: "Zagreb",
            destination: "Sarajevo",
            inTwoWays: false,
          },
        ],
      });
    }
  }, [userFromRedux]);

  const handleLogout = async () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to log out?",
      [
        {
          text: "No",
          onPress: () => console.log("Logout cancelled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            dispatch({ type: "LOGOUT" });
            await SecureStore.deleteItemAsync("user");
            await SecureStore.deleteItemAsync("token");
            // navigation.navigate("Login"); // ili reset na početni ekran ako je potrebno
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomScreenHeader title="Korisnički profil" />
      <View style={styles.contentContainer}>
        <Image source={{ uri: user?.image }} style={styles.profileImage} />
        <Text style={styles.text}>
          Name: {user?.first_name} {user?.last_name}
        </Text>
        <Text style={styles.text}>Email: {user?.email}</Text>
        <Text style={styles.text}>
          Tickets history: {user?.tickets?.length}
        </Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Odjavi se</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  footer: {
    paddingHorizontal: 20,
    // backgroundColor: "white",
    // borderTopWidth: 1,
    // borderTopColor: "#adadad",
  },
  logoutButton: {
    backgroundColor: "#188DFD",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
