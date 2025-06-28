import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Started from "./src/screens/Started";
import Login from "./src/screens/auth/Login";
import ForgotPassword from "./src/screens/auth/ForgotPassword";
import BottomNavigator from "./src/screens/BottomNavigator";
import ManageMenu from "./src/screens/menu/ManageMenu";
import RestaurantSchedule from "./src/screens/RestaurantSchedule";
import Profile from "./src/screens/profile/Profile";
import OrderSummary from "./src/screens/OrderSummary/OrderSummary";
import OffersScreen from "./src/screens/offers/OffersScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Started">
          <Stack.Screen
            name="Started"
            component={Started}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={BottomNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ManageMenu"
            component={ManageMenu}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "white" },
            }}
          />
          <Stack.Screen
            name="Offers"
            component={OffersScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "white" },
            }}
          />
          <Stack.Screen
            name="RestaurantSchedule"
            component={RestaurantSchedule}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "white" },
            }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "white" },
            }}
          />
          <Stack.Screen
            name="OrderSummary"
            component={OrderSummary}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "white" },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
