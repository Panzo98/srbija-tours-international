import axios from "axios";

export const fetchSalePriceBetweenCities = async (city1, city2) => {
  try {
    const response = await axios.get(
      `https://drivesoft-srbijatours.com/api/v1/prices/sale/${city1}/${city2}`
    );
    console.log("fetchSalePriceBetweenCities done");
    return response.data;
  } catch (error) {
    console.log("fetchSalePriceBetweenCities error", error);
    throw error;
  }
};

export const fetchPriceForRoute = async (
  direction,
  city1,
  city2,
  date,
  passengers
) => {
  try {
    const response = await axios.get(
      `https://drivesoft-srbijatours.com/api/v1/price/${direction}/${city1}/${city2}/${date}/[${passengers}]`
    );
    console.log("fetchPriceForRoute done");

    return response.data;
  } catch (error) {
    console.log("fetchPriceForRoute error", error);

    throw error;
  }
};

export const fetchPriceForRoundTrip = async (
  direction,
  city1,
  city2,
  date,
  date2,
  passengers
) => {
  try {
    const response = await axios.get(
      `https://drivesoft-srbijatours.com/api/v1/price/${direction}/${city1}/${city2}/${date}/${date2}/[${passengers}]`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
