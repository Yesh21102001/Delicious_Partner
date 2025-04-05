import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

function Profile() {
  const [name, setName] = useState('John Doe');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [mail, setMail] = useState('');

  const handleSave = () => {
    console.log('Profile Saved:', { name, phone, email, mail });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="white" />
      <ScrollView contentContainerStyle={styles.container}>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150' }}
            style={styles.avatar}
          />
        </View>

        {/* Profile Name */}
        <Text style={styles.name}>{name}</Text>

        {/* Edit Profile Button */}
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Mail"
            placeholderTextColor="#aaa"
            value={mail}
            onChangeText={setMail}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

export default Profile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f1f6', // Black background for consistency
  },
  container: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    marginTop: 30,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 100,
    padding: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  editBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 25,
  },
  editBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  inputContainer: {
    width: '100%',
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
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  saveBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
    width: '90%',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
