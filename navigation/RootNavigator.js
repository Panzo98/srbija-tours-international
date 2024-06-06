import React, { useState, useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import MainTabNavigator from "./MainTabNavigator";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import BusLoader from "../components/BusLoader";
import NetInfo from "@react-native-community/netinfo";
import { checkRoute } from "../api/AuthService";

const RootNavigator = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.searchReducer.loading);
  const dispatch = useDispatch();
  const alertShownRef = useRef(false);

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected && !alertShownRef.current) {
        alertShownRef.current = true;
        handleNoInternet();
      } else if (state.isConnected) {
        alertShownRef.current = false;
        dispatch({ type: "SET_ONLINE_MODE" });
      }
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleNoInternet = async () => {
    const token = await SecureStore.getItemAsync("token");
    const user = await SecureStore.getItemAsync("user");
    dispatch({ type: "SET_OFFLINE_MODE", payload: { token, user } });
    Alert.alert(
      "Bez internet konekcije",
      "Trenutno ste offline, neke od mogućnosti neće biti dostupne."
    );
  };

  useEffect(() => {
    const loadAndVerifyToken = async () => {
      const token = await SecureStore.getItemAsync("token");
      const user = await SecureStore.getItemAsync("user");
      if (token && user) {
        dispatch({ type: "RESTORE_SESSION", payload: JSON.parse(user) });
        console.log("RESTORE_SESSION");
      } else {
        dispatch({ type: "LOGOUT" });
        console.log("LOGOUT");
      }
      dispatch({ type: "DISABLE_LOADING" });
    };

    loadAndVerifyToken();
  }, [dispatch]);

  return (
    <NavigationContainer>
      {isLoading && <BusLoader />}
      <MainTabNavigator />
    </NavigationContainer>
  );
};

export default RootNavigator;
