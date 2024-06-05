import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

export const getCsrfToken = async () => {
  try {
    let response = await axios.get(
      "https://drivesoft-srbijatours.com/api/v1/csrf-token"
    );
    if (response.data.csrf_token) {
      return response.data.csrf_token;
    } else {
      throw new Error("CSRF token is null");
    }
  } catch (error) {
    console.log(error);
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("token");
    // Alert.alert("CSRF TOKEN", "Greska prilikom prikupljanja CSRF tokena!");
    console.log("CSRF TOKEN ERROR");
    return null;
  }
};

export const checkRoute = async () => {
  try {
    const csrfToken = await getCsrfToken();
    if (!csrfToken) return;

    const user = await SecureStore.getItemAsync("user");
    if (user) {
      const token = await SecureStore.getItemAsync("token");

      let response = await axios.get(
        "https://drivesoft-srbijatours.com/api/v1/check",
        {
          headers: {
            "X-CSRF-Token": csrfToken,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response?.data?.user?.is_active) {
        await SecureStore.deleteItemAsync("user");
        await SecureStore.deleteItemAsync("token");
        return Alert.alert("Nalog", "Vas nalog vise nije aktivan!");
      }

      await SecureStore.setItemAsync(
        "user",
        JSON.stringify(response.data.user)
      );
      console.log("USER LOGGED IN AND CHECKED");
    } else {
      console.log("GUEST ACCESS GRANTED");
    }
  } catch (error) {
    console.log("ERROR ON CHECK ROUTE:", error);
  }
};
