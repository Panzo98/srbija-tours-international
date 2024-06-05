import { useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import axios from "../utils/axiosConfig";

export const useFetchActions = () => {
  const dispatch = useDispatch();

  const fetchAllCities = async () => {
    dispatch({ type: "SET_LOADING" });
    try {
      const response = await axios.get("/all_cities");
      dispatch({ type: "DISABLE_LOADING" });
      return response.data;
    } catch (error) {
      dispatch({ type: "DISABLE_LOADING" });
      console.log("Greska prilikom fetchovanja all_cities");
      throw error;
    }
  };
  const getReservations = async (page = 1) => {
    try {
      dispatch({ type: "SET_LOADING" });
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(`/passenger/reservations?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error(`Unexpected response status: ${response.status}`);
      }

      dispatch({
        type: page === 1 ? "SET_TICKETS" : "ADD_TICKETS",
        payload: response.data,
      });
      dispatch({ type: "DISABLE_LOADING" });
      return response.data;
    } catch (error) {
      dispatch({ type: "REMOVE_TICKETS" });
      dispatch({ type: "DISABLE_LOADING" });

      if (error.response) {
        console.error(
          "Server error:",
          error.response.status,
          error.response.data.message
        );
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Error:", error.message);
      }
      return {
        error:
          "An error occurred while fetching reservations. Please try again later.",
      };
    }
  };

  const fetchDestinationCities = async (cityId) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const response = await axios.get(`/dest_cities/${cityId}`);
      dispatch({ type: "DISABLE_LOADING" });

      return response.data;
    } catch (error) {
      dispatch({ type: "DISABLE_LOADING" });
      console.log("Greska prilikom fetchovanja desti_cities");
      throw error;
    }
  };
  const fetchDatesBetweenCities = async (city1, city2) => {
    try {
      dispatch({ type: "SET_LOADING" });

      const response = await axios.get(`/dates/${city1}/${city2}`);
      dispatch({ type: "DISABLE_LOADING" });

      return response.data;
    } catch (error) {
      dispatch({ type: "DISABLE_LOADING" });

      console.log("Greska prilikom fetchovanja datuma!", error);
      throw error;
    }
  };

  const fetchDatesForRouteOnDate = async (city1, city2, date) => {
    try {
      dispatch({ type: "SET_LOADING" });

      const response = await axios.get(`/dates/${city1}/${city2}/${date}`);
      dispatch({ type: "DISABLE_LOADING" });

      return response.data;
    } catch (error) {
      dispatch({ type: "DISABLE_LOADING" });

      console.log("Greska prilikom fetchovanja datuma!");
      throw error;
    }
  };
  const fetchSalePriceBetweenCities = async (city1, city2) => {
    dispatch({ type: "SET_LOADING" });

    try {
      const response = await axios.get(`/prices/sale/${city1}/${city2}`);
      dispatch({ type: "DISABLE_LOADING" });

      console.log("fetchSalePriceBetweenCities done");
      return response.data;
    } catch (error) {
      dispatch({ type: "DISABLE_LOADING" });

      console.log("fetchSalePriceBetweenCities error", error);
      throw error;
    }
  };

  const fetchPriceForRoute = async (
    direction,
    city1,
    city2,
    date,
    passengers
  ) => {
    try {
      dispatch({ type: "SET_LOADING" });

      const response = await axios.get(
        `/price/${direction}/${city1}/${city2}/${date}/[${passengers}]`
      );
      console.log("fetchPriceForRoute done");
      dispatch({ type: "DISABLE_LOADING" });

      return response.data;
    } catch (error) {
      dispatch({ type: "DISABLE_LOADING" });

      console.log("fetchPriceForRoute error", error);

      throw error;
    }
  };

  const fetchPriceForRoundTrip = async (
    direction,
    city1,
    city2,
    date,
    date2,
    passengers
  ) => {
    try {
      dispatch({ type: "SET_LOADING" });

      const response = await axios.get(
        `/price/${direction}/${city1}/${city2}/${date}/${date2}/[${passengers}]`
      );
      dispatch({ type: "DISABLE_LOADING" });

      return response.data;
    } catch (error) {
      dispatch({ type: "DISABLE_LOADING" });

      throw error;
    }
  };

  return {
    fetchAllCities,
    fetchDestinationCities,
    fetchDatesBetweenCities,
    fetchDatesForRouteOnDate,
    getReservations,
    fetchPriceForRoundTrip,
    fetchPriceForRoute,
    fetchSalePriceBetweenCities,
  };
};
