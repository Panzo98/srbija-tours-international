import React from "react";
import { View, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TicketsScreen from "../screens/TicketsScreen";
import TermsScreen from "../screens/TermsScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import ChooseLineScreen from "../screens/ChooseLineScreen";
import PreOrderScreen from "../screens/PreOrderScreen";
import PaymentMethodScreen from "../screens/PaymentMethodScreen";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("window");
const isLargeScreen = width > 600;

const MainTabNavigator = () => {
  return (
    <View style={{ width, height }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "white",
            height: 72,
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
            let iconSize = 32;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
              iconType = Ionicons;
            } else if (route.name === "Tickets") {
              iconName = focused ? "ticket" : "ticket-outline";
              iconType = Ionicons;
            } else if (route.name === "Terms") {
              iconName = focused ? "infocirlce" : "infocirlceo";
              iconType = AntDesign;
              if (isLargeScreen) {
                iconSize = 28;
              }
            } else if (route.name === "Profile") {
              iconName = focused ? "account" : "account-outline";
              iconType = MaterialCommunityIcons;
            }

            return (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  paddingTop: isLargeScreen ? 10 : 0,
                }}
              >
                <View
                  style={{
                    height: 5,
                    width: "60%",
                    // backgroundColor: focused ? "dodgerblue" : "transparent",
                    position: "absolute",
                    top: 0,
                  }}
                />
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
        <Tab.Screen name="Profile" component={ProfileScreen} />
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
      </Tab.Navigator>
    </View>
  );
};

export default MainTabNavigator;
