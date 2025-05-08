import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleLogin = async () => {
    navigation.navigate('Home');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../../assets/Logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Welcome Back!</Text>

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

      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={20} color="#7D5A50" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#B2A59B"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#3B271C" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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
  },
  buttonText: {
    color: '#3B271C',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#C8AE7D',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Login;
