import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importing Ionicons

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSubmit = () => {
    if (!email) {
      Alert.alert('Validation Error', 'Please enter your email');
      return;
    }

    Alert.alert('Password Reset', 'A password reset link has been sent to your email');
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../../assets/Logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.instructions}>
        Enter your email address to receive a password reset link.
      </Text>

      {/* Email Input Container */}
      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={20} color="#7D5A50" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#B2A59B"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>

      {/* Back to Login */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backToLoginText}>Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#3B271C',
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: '#F5E8C7',
    textAlign: 'center',
    marginBottom: 30,
  },
  instructions: {
    fontSize: 16,
    color: '#F5E8C7',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5E8C7',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E0C097',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
    color: '#3B271C',
  },
  button: {
    backgroundColor: '#E8BA58',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonText: {
    color: '#3B271C',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backToLoginText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#C8AE7D',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPassword;
