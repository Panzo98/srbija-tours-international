import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import CustomScreenHeader from "../components/CustomScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAssets } from "expo-asset";

const ProfileScreen = ({ navigation }) => {
  const { width, height } = Dimensions.get("window");

  const user = useSelector((state) => state.auth.user);
  const [assets] = useAssets([
    require("../assets/images/company-logo-white.png"),
  ]);

  const dispatch = useDispatch();

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
            navigation.navigate("Login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const data = [
    { id: "1", title: "Need help?", onPress: () => {} },
    { id: "2", title: "T&Cs", onPress: () => {} },
    { id: "3", title: "Privacy policy", onPress: () => {} },
    { id: "4", title: "Station Locations", onPress: () => {} },
    { id: "5", title: "Legal Notice", onPress: () => {} },
    { id: "6", title: "Settings", onPress: () => {} },
    { id: "7", title: "Send us feedback!", onPress: () => {} },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={item.onPress}>
      <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  );
  if (!assets)
    return (
      <View>
        <Text>Učitavanje</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* <CustomScreenHeader title="More" /> */}
      <View style={{ flex: 1 }}>
        <View style={styles.contentContainer}>
          <Image source={assets[2]} style={styles.profileImage} />
          <Text style={styles.text}>
            {user.first_name} {user.last_name}
          </Text>
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
          <Text style={styles.logoutButtonText}>Log out</Text>
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
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  text: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
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
