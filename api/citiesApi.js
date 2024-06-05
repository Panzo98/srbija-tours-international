import axios from "axios";
import { useDispatch } from "react-redux";

const dispatch = useDispatch();

export const fetchAllCities = async () => {
  dispatch({ type: "SET_LOADING" });
  try {
    const response = await axios.get(
      "https://drivesoft-srbijatours.com/api/v1/all_cities"
    );
    dispatch({ type: "DISABLE_LOADING" });

    return response.data;
  } catch (error) {
    dispatch({ type: "DISABLE_LOADING" });

    console.log("Greska prilikom fetchovanja all_cities");
    throw error;
  }
};

export const fetchDestinationCities = async (cityId) => {
  dispatch({ type: "SET_LOADING" });

  try {
    const response = await axios.get(
      `https://drivesoft-srbijatours.com/api/v1/dest_cities/${cityId}`
    );
    dispatch({ type: "DISABLE_LOADING" });

    return response.data;
  } catch (error) {
    dispatch({ type: "DISABLE_LOADING" });

    console.log("Greska prilikom fetchovanja desti_cities");
    throw error;
  }
};
