import React from "react";
import { View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TicketsScreen from "../screens/TicketsScreen";
import TermsScreen from "../screens/TermsScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import ChooseLineScreen from "../screens/ChooseLineScreen";
import PreOrderScreen from "../screens/PreOrderScreen";
import PaymentMethodScreen from "../screens/PaymentMethodScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SearchCityScreen from "../screens/SearchCityScreen";
import { useSelector } from "react-redux";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const { width } = Dimensions.get("window");
const isLargeScreen = width > 600;

const MainTabNavigator = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const ProfileStackNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Profile" component={ProfileScreen} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarHideOnKeyboard: true,
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "white",
              height: 70,
              paddingBottom: 10,
              borderTopColor: "#adadad",
            },
            tabBarLabelStyle: {
              display: "none",
            },
            tabBarActiveTintColor: "dodgerblue",
            tabBarInactiveTintColor: "gray",
            tabBarIcon: ({ color, size, focused }) => {
              let iconName;
              let iconType;
              let iconSize = isLargeScreen ? 40 : 28;

              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline";
                iconType = Ionicons;
              } else if (route.name === "Tickets") {
                iconName = focused ? "ticket" : "ticket-outline";
                iconType = Ionicons;
              } else if (route.name === "Terms") {
                iconName = focused ? "infocirlce" : "infocirlceo";
                iconType = AntDesign;
              } else if (route.name === "ProfileStack") {
                iconName = focused ? "account" : "account-outline";
                iconType = MaterialCommunityIcons;
              }

              return (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  {React.createElement(iconType, {
                    name: iconName,
                    size: iconSize,
                    color,
                  })}
                </View>
              );
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Tickets" component={TicketsScreen} />
          <Tab.Screen name="Terms" component={TermsScreen} />
          <Tab.Screen
            name="ProfileStack"
            component={ProfileStackNavigator}
            options={{ tabBarLabel: "Profile" }}
          />
          <Tab.Screen
            name="ConfirmationScreen"
            component={ConfirmationScreen}
            options={{ tabBarButton: () => null }}
          />
          <Tab.Screen
            name="ChooseLineScreen"
            component={ChooseLineScreen}
            options={{ tabBarButton: () => null }}
          />
          <Tab.Screen
            name="PaymentMethodScreen"
            component={PaymentMethodScreen}
            options={{ tabBarButton: () => null }}
          />
          <Tab.Screen
            name="PreOrderScreen"
            component={PreOrderScreen}
            options={{ tabBarButton: () => null }}
          />
          <Tab.Screen
            name="SearchCityScreen"
            component={SearchCityScreen}
            options={{ tabBarButton: () => null }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default MainTabNavigator;
