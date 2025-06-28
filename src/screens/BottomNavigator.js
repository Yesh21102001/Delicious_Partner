import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Image,
  StatusBar,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import Home from "../screens/home/Home";
import Menu from "../screens/menu/Menu";
import Insights from "../screens/insights/Insights";
import Orders from "../screens/Orders/Orders";
import NewOrder from "../screens/NewOrder/NewOrder";
import { Ionicons } from "@expo/vector-icons";
import ManageMenu from "./menu/ManageMenu";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const { width } = Dimensions.get("window");

const BottomNavigator = () => {
  const [restaurantOnline, setRestaurantOnline] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSidebar, setSelectedSidebar] = useState(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const sidebarTranslate = useRef(new Animated.Value(width)).current;
  const navigation = useNavigation();

  const toggleSwitch = () => {
    const newValue = !restaurantOnline;
    setRestaurantOnline(newValue);
    Animated.timing(animatedValue, {
      toValue: newValue ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    Animated.timing(sidebarTranslate, {
      toValue: isSidebarOpen ? width : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSidebarPress = (item) => {
    setSelectedSidebar(item);
    toggleSidebar();

    if (item === "Add-Menu") {
      navigation.navigate("ManageMenu");
    } else if (item === "Home") {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } else if (item === "Log Out") {
      navigation.navigate("Login");
    } else if (item === "Schedule Time-On") {
      navigation.reset({
        index: 0,
        routes: [{ name: "RestaurantSchedule" }],
      });
    } else if (item === "Profile") {
      navigation.navigate("Profile");
    } else if (item === "Offers") {
      navigation.navigate("Offers");
    }
  };

  return (
    <>
      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          { transform: [{ translateX: sidebarTranslate }] },
        ]}
      >
        <Text style={styles.restaurantName1}>Bhimavaram</Text>
        <Text style={styles.restaurantName}>Delicious Restaurant</Text>

        <View style={styles.divider} />

        {/* Profile Section */}
        <TouchableOpacity
          style={styles.profileSection}
          onPress={() => handleSidebarPress("Profile")}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=3" }}
            style={styles.avatar}
          />
          <Text style={styles.profileName}>John Doe</Text>
        </TouchableOpacity>

        {/* Sidebar Main Content & Logout */}
        <View style={styles.sidebarContentContainer}>
          <View style={styles.sidebarContent}>
            {["Home", "Dining", "Add-Menu", "Schedule Time-On", "Offers"].map(
              (item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.sidebarItem,
                    selectedSidebar === item && styles.sidebarSelected,
                  ]}
                  onPress={() => handleSidebarPress(item)}
                >
                  <Text style={styles.sidebarText}>{item}</Text>
                </TouchableOpacity>
              )
            )}
          </View>

          {/* Log Out at Bottom */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={[
                styles.logoutButton,
                selectedSidebar === "Log Out" && styles.sidebarSelected,
              ]}
              onPress={() => handleSidebarPress("Log Out")}
            >
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Stack Navigator */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main">
          {() => (
            <SafeAreaView style={styles.container}>
              <StatusBar backgroundColor="white" barStyle="white" />
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity
                  style={[
                    styles.switch,
                    restaurantOnline ? styles.switchOn : styles.switchOff,
                  ]}
                  onPress={toggleSwitch}
                  activeOpacity={0.8}
                >
                  <Animated.View
                    style={[
                      styles.thumb,
                      {
                        transform: [
                          {
                            translateX: animatedValue.interpolate({
                              inputRange: [0, 1],
                              outputRange: [2, 42],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.switchText,
                        restaurantOnline ? styles.onText : styles.offText,
                      ]}
                    >
                      {restaurantOnline ? "Online" : "Offline"}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={toggleSidebar}
                >
                  <Ionicons name="menu" size={30} color="black" />
                </TouchableOpacity>
              </View>

              {/* Bottom Tab Navigator */}
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused }) => {
                    let iconName;
                    if (route.name === "Home") iconName = "home-outline";
                    else if (route.name === "Menu")
                      iconName = "restaurant-outline";
                    else if (route.name === "Orders")
                      iconName = "receipt-outline";
                    else if (route.name === "Insights")
                      iconName = "analytics-outline";
                    return (
                      <Ionicons
                        name={iconName}
                        size={28}
                        color={focused ? "#6C4E31" : "gray"}
                      />
                    );
                  },
                  tabBarActiveTintColor: "#6C4E31",
                  tabBarInactiveTintColor: "gray",
                  tabBarStyle: {
                    backgroundColor: "white",
                    borderTopWidth: 0,
                    elevation: 5,
                    height: 80,
                  },
                  tabBarLabelStyle: {
                    fontSize: 14,
                    fontWeight: "bold",
                    marginBottom: 10,
                  },
                  tabBarIconStyle: { marginTop: 10 },
                  headerShown: false,
                })}
              >
                <Tab.Screen name="Home" component={Home} />
                <Tab.Screen name="Menu">
                  {() => (
                    <Menu
                      restaurantOnline={restaurantOnline}
                      setRestaurantOnline={setRestaurantOnline}
                    />
                  )}
                </Tab.Screen>

                <Tab.Screen name="Orders" component={Orders} />
                <Tab.Screen name="Insights" component={Insights} />
              </Tab.Navigator>
            </SafeAreaView>
          )}
        </Stack.Screen>

        {/* Additional Screens */}
        <Stack.Screen
          name="NewOrder"
          component={NewOrder}
          options={{ headerShown: true, title: "New Order" }}
        />
        <Stack.Screen
          name="ManageMenu"
          component={ManageMenu}
          options={{ headerShown: true, title: "Manage Menu" }}
        />
      </Stack.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    height: 100,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    right: 0,
    width: width * 0.75,
    height: "100%",
    backgroundColor: "white",
    padding: 20,
    zIndex: 20,
  },
  restaurantName: {
    color: "#603F26",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  restaurantName1: {
    color: "#603F26",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    marginTop: 50,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "flex-start",
    marginTop: 15,
    backgroundColor: "#FFEAC5",
    padding: 10,
    borderRadius: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  divider: {
    height: 2,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  sidebarContentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  sidebarContent: { marginTop: 10 },
  sidebarItem: { padding: 15, borderRadius: 8 },
  sidebarSelected: { backgroundColor: "#F5E8C7" },
  sidebarText: { fontSize: 18 },
  logoutContainer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  switch: {
    width: 80,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    padding: 2,
    marginTop: 20,
  },
  switchOn: { backgroundColor: "green" },
  switchOff: { backgroundColor: "red" },
  thumb: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  switchText: { fontSize: 10, fontWeight: "bold" },
  onText: { color: "green" },
  offText: { color: "red" },
  menuButton: { padding: 10, marginTop: 20 },
  logoutButton: {
    backgroundColor: "#603F26",
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default BottomNavigator;
