import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const NewOrder = ({ navigation }) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [description, setDescription] = useState('');

  // Remove header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSubmit = () => {
    if (!itemName || !quantity || !description) {
      Alert.alert('Error', 'Please fill out all fields.');
    } else {
      Alert.alert('Order Submitted', `Item: ${itemName}\nQuantity: ${quantity}\nDescription: ${description}`);
      // API call to submit the order data
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Item Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter item name"
        value={itemName}
        onChangeText={setItemName}
      />

      <Text style={styles.label}>Quantity</Text>
      <Picker
        selectedValue={quantity}
        style={styles.picker}
        onValueChange={(itemValue) => setQuantity(itemValue)}
      >
        {[...Array(10).keys()].map((num) => (
          <Picker.Item key={num + 1} label={`${num + 1}`} value={`${num + 1}`} />
        ))}
      </Picker>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 80,
  },
  picker: {
    height: 50,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#E23744',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewOrder;