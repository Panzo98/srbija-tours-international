import React from "react";
import { View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
const { width } = Dimensions.get("window");
const isLargeScreen = width > 600;

const MainTabNavigator = () => {
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
              // paddingTop: 10,
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
    </SafeAreaView>
  );
};

export default MainTabNavigator;
