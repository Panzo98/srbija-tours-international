import axios, { toFormData } from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "https://drivesoft-srbijatours.com/api/v1/reservations";

const getReservations = async () => {
  try {
    const token = await SecureStore.getItemAsync("token");
    console.log(token);
    const response = await axios.get(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting reservation:", error);
    throw error;
  }
};

export default getReservations;
