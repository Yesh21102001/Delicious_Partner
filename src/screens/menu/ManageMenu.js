import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const ManageMenu = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [itemImage, setItemImage] = useState(null); // File/Image object

  const addCategory = () => {
    if (categoryName) {
      setCategories([...categories, { name: categoryName, items: [] }]);
      setCategoryName("");
    }
  };

  const addItemToCategory = () => {
    if (selectedCategoryIndex !== null && itemName && itemCost && itemImage) {
      const updatedCategories = categories.map((category, index) => {
        if (index === selectedCategoryIndex) {
          return {
            ...category,
            items: [
              ...category.items,
              { name: itemName, cost: itemCost, image: itemImage.uri },
            ],
          };
        }
        return category;
      });
      setCategories(updatedCategories);
      setItemName("");
      setItemCost("");
      setItemImage(null);
    } else {
      Alert.alert("Error", "Please fill all fields and select an image.");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setItemImage(result.assets[0]); // setting image object
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter Category Name"
          value={categoryName}
          onChangeText={setCategoryName}
          style={styles.input}
        />
        <TouchableOpacity style={styles.addButton} onPress={addCategory}>
          <Ionicons name="add-circle" size={32} color="#3B271C" />
        </TouchableOpacity>
      </View>

      {categories.map((category, index) => (
        <View key={index} style={styles.categoryCard}>
          <TouchableOpacity onPress={() => setSelectedCategoryIndex(index)}>
            <Text
              style={[
                styles.categoryTitle,
                selectedCategoryIndex === index && styles.selectedCategory,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
          {category.items.map((menuItem, idx) => (
            <View key={idx} style={styles.itemCard}>
              {menuItem.image ? (
                <Image
                  source={{ uri: menuItem.image }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
              ) : null}
              <Text style={styles.itemText}>
                {menuItem.name} - ₹{menuItem.cost}
              </Text>
            </View>
          ))}
        </View>
      ))}

      {selectedCategoryIndex !== null && (
        <View style={styles.itemInputContainer}>
          <Text style={styles.subtitle}>
            Add Item to {categories[selectedCategoryIndex]?.name}
          </Text>
          <TextInput
            placeholder="Item Name"
            value={itemName}
            onChangeText={setItemName}
            style={styles.input}
          />
          <TextInput
            placeholder="Item Cost"
            value={itemCost}
            onChangeText={setItemCost}
            keyboardType="numeric"
            style={styles.input}
          />
          <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
            <Text style={styles.pickImageText}>Pick Image</Text>
          </TouchableOpacity>
          {itemImage && (
            <Image
              source={{ uri: itemImage.uri }}
              style={styles.previewImage}
            />
          )}
          <TouchableOpacity style={styles.button} onPress={addItemToCategory}>
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8BA58",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#F5E8C7",
    marginRight: 10,
    marginBottom: 10,
  },
  addButton: { justifyContent: "center", alignItems: "center" },
  categoryCard: {
    padding: 15,
    backgroundColor: "#E8BA58",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  selectedCategory: { color: "#3B271C" },
  itemCard: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#F5E8C7",
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: { fontSize: 18, color: "#555", marginLeft: 10 },
  itemImage: { width: 50, height: 50, borderRadius: 5 },
  itemInputContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#E8BA58",
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#3B271C",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    width: 345,
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  subtitle: { marginBottom: 10 },
  pickImageButton: {
    backgroundColor: "#3B271C",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    width: 340,
  },
  pickImageText: { color: "#fff", fontWeight: "bold" },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "center",
  },
});

export default ManageMenu;
