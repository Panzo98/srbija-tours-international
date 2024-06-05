import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./store";
import RootNavigator from "./navigation/RootNavigator";
import { LogBox } from "react-native";

export default function App() {
  LogBox.ignoreLogs(["ViewPropTypes will be removed from React Native"]);
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
