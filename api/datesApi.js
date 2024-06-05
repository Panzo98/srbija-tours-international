import axios from "axios";

export const fetchDatesBetweenCities = async (city1, city2) => {
  try {
    const response = await axios.get(
      `https://drivesoft-srbijatours.com/api/v1/dates/${city1}/${city2}`
    );
    return response.data;
  } catch (error) {
    console.log("Greska prilikom fetchovanja datuma!", error);
    throw error;
  }
};

export const fetchDatesForRouteOnDate = async (city1, city2, date) => {
  try {
    const response = await axios.get(
      `https://drivesoft-srbijatours.com/api/v1/dates/${city1}/${city2}/${date}`
    );
    return response.data;
  } catch (error) {
    console.log("Greska prilikom fetchovanja datuma!");
    throw error;
  }
};
