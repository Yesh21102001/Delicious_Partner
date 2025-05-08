import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Started from './src/screens/Started';
import Login from './src/screens/auth/Login';
import ForgotPassword from './src/screens/auth/ForgotPassword';
import BottomNavigator from './src/screens/BottomNavigator';
import ManageMenu from './src/screens/menu/ManageMenu';
import RestaurantSchedule from './src/screens/RestaurantSchedule';
import Profile from './src/screens/profile/Profile';
import OrderSummary from './src/screens/OrderSummary/OrderSummary';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
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
          <Stack.Screen name="ManageMenu" component={ManageMenu} options={{ headerShown: true }} />
          <Stack.Screen name="RestaurantSchedule" component={RestaurantSchedule} options={{ headerShown: true }} />
          <Stack.Screen name="Profile" component={Profile} options={{ headerShown: true }} />
          <Stack.Screen name="OrderSummary" component={OrderSummary} options={{ headerShown: true }} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
