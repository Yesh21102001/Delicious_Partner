import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Swiper from "react-native-swiper";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const Started = ({ navigation }) => {
  const slides = [
    {
      id: 1,
      description: "Manage Orders and menu in a breeze.",
      image: require("../assets/high-angle-arrangement-different-pakistan-goodies.jpg"),
    },
    {
      id: 2,
      description: "Get business insights and improvement tips.",
      image: require("../assets/top-view-finger-pressing-percentage-tablet.jpg"),
    },
    {
      id: 3,
      description: "Manage Luxurious Dining Bookings.",
      image: require("../assets/classic-luxury-style-restaurant-with-tables-chairs.jpg"),
    },
  ];

  const handleGetStarted = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Swiper
        autoplay
        autoplayTimeout={3}
        showsPagination
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        loop={false}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            <ImageBackground source={slide.image} style={styles.backgroundImage}>
              <LinearGradient
                colors={[
                  "rgba(59, 39, 28, 0.2)",
                  "rgba(59, 39, 28, 0.5)",
                  "rgba(59, 39, 28, 0.8)",
                ]}
                style={styles.overlay}
              />
              <View style={styles.textContainer}>
                <Text style={styles.description}>{slide.description}</Text>
              </View>

              {index === slides.length - 1 && (
                <View style={styles.buttonWrapper}>
                  <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                    <Text style={styles.buttonText}>Get Started</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ImageBackground>
          </View>
        ))}
      </Swiper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  slide: { flex: 1 },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
  overlay: { ...StyleSheet.absoluteFillObject },
  textContainer: {
    position: "absolute",
    bottom: 150,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "left",
    lineHeight: 30,
    marginBottom: 30,
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 70,
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#f0cb75",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "#3B271C",
    fontSize: 18,
    fontWeight: "bold",
  },
  dotStyle: {
    backgroundColor: "#ccc",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
    marginBottom: 20,
  },
  activeDotStyle: {
    backgroundColor: "#f0cb75",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
    marginBottom: 20,
  },
});

export default Started;