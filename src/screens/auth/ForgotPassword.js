import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');

  // Disable the header for this screen
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,  // This will hide the header for the Forgot Password screen
    });
  }, [navigation]);

  const handleSubmit = () => {
    if (!email) {
      Alert.alert('Validation Error', 'Please enter your email');
      return;
    }

    // Simulate sending a reset link (you can replace this with actual logic)
    Alert.alert('Password Reset', 'A password reset link has been sent to your email');
    navigation.navigate('Login'); // Navigate back to Login after submitting
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.instructions}>
        Enter your email address to receive a password reset link.
      </Text>

      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Submit button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>

      {/* Back to login link */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backToLoginText}>Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f1f6', // Light background color for a soft feel
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  instructions: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  input: {
    height: 55,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000', // Add subtle shadow for modern feel
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  button: {
    backgroundColor: '#4CAF50', // Modern green color
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5, // Add shadow for a raised effect
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backToLoginText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#4CAF50', // Modern green color for "Back to Login"
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPassword;
