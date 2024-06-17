import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import CustomScreenHeader from "../components/CustomScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = ({ navigation }) => {
  const { width, height } = Dimensions.get("window");

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const handleLogout = async () => {
    Alert.alert(
      "Potvrda",
      "Da li zelite da se odjavite?",
      [
        {
          text: "Ne",
          onPress: () => console.log("Logout cancelled"),
          style: "cancel",
        },
        {
          text: "Da",
          onPress: async () => {
            dispatch({ type: "LOGOUT" });
            await SecureStore.deleteItemAsync("user");
            await SecureStore.deleteItemAsync("token");
            navigation.navigate("Login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const openURL = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url).catch((err) =>
        console.error("Error opening URL:", err)
      );
    } else {
      Alert.alert("Error", `Unable to open URL: ${url}`);
    }
  };

  const data = [
    {
      id: "1",
      title: "Trebaš pomoć?",
      onPress: () => openURL("tel:+381648266044"),
    },
    {
      id: "2",
      title: "Lokacije stanica",
      onPress: () => openURL("https://srbijatours.com/poslovnice/"),
    },
    {
      id: "3",
      title: "Podrška za rezervacije",
      onPress: () => openURL("tel:+381648266000"),
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={item.onPress}>
      <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.contentContainer}>
          <Text style={styles.text}>
            {user.first_name} {user.last_name}
          </Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Datum rođenja:</Text>
            <Text style={styles.infoText}>{user.birth_date}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Telefon:</Text>
            <Text style={styles.infoText}>{user.phone}</Text>
          </View>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          ListFooterComponent={
            <Text style={styles.versionText}>v. 1.0.0 (1)</Text>
          }
        />
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              marginHorizontal: width * 0.04,
              borderRadius: 5,
              height: height * 0.07,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>ODJAVI SE</Text>
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
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#188DFD",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  text: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  infoContainer: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginRight: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#fff",
  },
  list: {
    flex: 1,
    backgroundColor: "#fff",
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
  versionText: {
    textAlign: "center",
    color: "#aaa",
    padding: 10,
  },
  logoutButton: {
    backgroundColor: "#188DFD",
    padding: 15,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
