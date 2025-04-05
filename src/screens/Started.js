import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, StatusBar  } from 'react-native';
import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('window');

const Started = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // State to manage hover effect
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Function to handle hover effect (set the hovered image index)
  const handleHoverIn = (index) => {
    setHoveredIndex(index);
  };

  const handleHoverOut = () => {
    setHoveredIndex(null);
  };

  // Function to render the images with text at the bottom
  const renderImage = (source, index, text) => {
    return (
      <TouchableOpacity
        style={styles.imageContainer}
        activeOpacity={0.9} // Simulating hover effect on press
        onPressIn={() => handleHoverIn(index)} // Apply hover effect on press
        onPressOut={handleHoverOut} // Remove hover effect when press ends
      >
        <Image
          source={source}
          style={[styles.image, hoveredIndex === index && styles.imageHovered]} // Add hover style
        />
        {/* Darken effect when hovered */}
        {hoveredIndex === index && <View style={styles.overlay} />}
        {/* Black effect at the bottom of the image */}
        <View style={styles.blackBottomOverlay} />
        {/* Text at the bottom of the image */}
        <View style={styles.textContainer}>
          <Text style={styles.text}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        autoplay={true}
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        paginationStyle={styles.paginationStyle}
      >
        <View style={styles.slide}>
          {renderImage(require('../assets/high-angle-arrangement-different-pakistan-goodies.jpg'), 0, 'Manage Orders and menu in a breeze')}
        </View>
        <View style={styles.slide}>
          {renderImage(require('../assets/top-view-finger-pressing-percentage-tablet.jpg'), 1, 'Get business insights and improvement tips')}
        </View>
        <View style={styles.slide}>
          {renderImage(require('../assets/classic-luxury-style-restaurant-with-tables-chairs.jpg'), 2, 'Manage Luxurious Dining Bookings')}
        </View>
      </Swiper>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapper: {
    height: "85%",
  },
  slide: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: width,
    height: height * 0.8,
  },
  image: {
    width: width,
    height: height * 0.8,
    resizeMode: 'cover',
    transition: 'transform 0.3s ease',  
  },
  imageHovered: {
    transform: [{ scale: 1.1 }]  
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    opacity: 0.3, 
  },
  blackBottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: height * 0.9,
    backgroundColor: 'black',
    opacity: 0.6, 
  },
  textContainer: {
    position: 'absolute',
    bottom: 20,  
    left: 20,
    right: 20,
    justifyContent: 'left',
    alignItems: 'left',
    zIndex: 1, 
  },
  text: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 50,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 80,
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paginationStyle: {
    bottom: 30, 
  },
  dotStyle: {
    width: 8,  
    height: 8, 
    borderRadius: 4,
    marginHorizontal: 5,  
  },
  activeDotStyle: {
    width: 8,  
    height: 8, 
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
});

export default Started;
