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
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import CustomScreenHeader from "../components/CustomScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");

const ProfileScreen = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    Alert.alert(
      "Potvrda",
      "Da li želite da se odjavite?",
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
      <View style={styles.header}>
        <Image
          source={require("../assets/images/company-logo-white.png")}
          style={styles.logo}
        />
      </View>
      <ScrollView>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.title}>Korisnički nalog</Text>
        </View>
        <View style={styles.profileContainer}>
          <View style={styles.profileInfoContainer}>
            <View style={styles.avatarContainer}>
              <Feather name="user" size={80} color="#188DFD" />
            </View>
            <Text
              style={styles.username}
            >{`${user.first_name} ${user.last_name}`}</Text>
            <TouchableOpacity style={styles.editIcon}>
              <Feather name="edit" size={24} color="#188DFD" />
            </TouchableOpacity>
          </View>
          <View style={styles.infoSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ime i prezime"
                value={`${user.first_name} ${user.last_name}`}
                editable={false}
                placeholderTextColor="#888"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="E-mail adresa"
                value={user.email}
                editable={false}
                placeholderTextColor="#888"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Broj telefona"
                value={user.phone}
                editable={false}
                placeholderTextColor="#888"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Lozinka"
                value="********"
                editable={false}
                placeholderTextColor="#888"
              />
            </View>
          </View>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Istorija rezervacija</Text>
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
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>ODJAVI SE</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  header: {
    backgroundColor: "#188DFD",
    paddingVertical: 20,
    alignItems: "center",
  },
  logo: {
    width: width * 0.6,
    height: height * 0.1,
    resizeMode: "contain",
  },
  title: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  profileContainer: {
    flex: 1,
    paddingHorizontal: width * 0.04,
  },
  profileInfoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatarContainer: {
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 20,
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
  },
  editIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  infoSection: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 50,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  sectionTitleContainer: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  list: {
    flex: 1,
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
    marginHorizontal: width * 0.04,
    borderRadius: 50,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
