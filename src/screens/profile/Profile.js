import React, { useState } from 'react';
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
  const [phone, setPhone] = useState('9876543210');
  const [email, setEmail] = useState('john@example.com');
  const [address, setAddress] = useState('123 Main St');
  const [imageUrl, setImageUrl] = useState('https://i.pravatar.cc/150');
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) {
      console.log('Profile Saved:', { name, phone, email, address, imageUrl });
    }
    setIsEditing(!isEditing);
  };

  const changeImage = () => {
    if (isEditing) {
      const newImageUrl = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`;
      setImageUrl(newImageUrl);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView contentContainerStyle={styles.container}>

        {/* Avatar */}
        <TouchableOpacity style={styles.avatarContainer} onPress={changeImage}>
          <Image source={{ uri: imageUrl }} style={styles.avatar} />
          {isEditing && <Text style={styles.changeText}>Tap to change</Text>}
        </TouchableOpacity>

        {/* Displayed Name only */}
        <Text style={styles.name}>{name}</Text>

        {/* Edit/Save Toggle Button */}
        <TouchableOpacity style={styles.editBtn} onPress={handleEditToggle}>
          <Text style={styles.editBtnText}>{isEditing ? 'Save Profile' : 'Edit Profile'}</Text>
        </TouchableOpacity>

        {/* Section Title in Edit Mode */}
        {isEditing && <Text style={styles.editSectionTitle}>Edit Your Details</Text>}

        {/* Input Fields */}
        <View style={styles.inputContainer}>

          {isEditing && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
            />
          )}

          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            placeholder="Phone Number"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            editable={isEditing}
          />

          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
          />

          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            placeholder="Address"
            placeholderTextColor="#aaa"
            value={address}
            onChangeText={setAddress}
            editable={isEditing}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Profile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f1f6',
  },
  container: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    marginTop: 30,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 100,
    padding: 5,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changeText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 6,
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
  editSectionTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    height: 55,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 20,
    paddingLeft: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  disabledInput: {
    backgroundColor: '#e6e6e6',
    color: '#999',
  },
});
