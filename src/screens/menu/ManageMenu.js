// ManageMenu.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const SERVER_URL = "http://192.168.29.186:2000";

const ManageMenu = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("Veg");
  const [categoryImage, setCategoryImage] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [itemImage, setItemImage] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [menuOptionsVisible, setMenuOptionsVisible] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedContext, setSelectedContext] = useState({
    type: null,
    id: null,
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/menu/getMenu`);
      const data = await response.json();
      const formatted = data.map((cat) => ({
        _id: cat._id,
        name: cat.name,
        cateimage: cat.cateimage,
        type: cat.categoryType,
        items: Array.isArray(cat.items)
          ? cat.items.map((item) => ({
              _id: item._id,
              name: item.itemName,
              cost: item.itemCost,
              image: item.image,
            }))
          : [],
      }));
      setCategories(formatted);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  const pickCategoryImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setCategoryImage(result.assets[0]);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setItemImage(result.assets[0]);
    }
  };

  const addCategory = async () => {
    if (!categoryName || !categoryImage) {
      Alert.alert("Error", "Please enter a name and pick an image.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", categoryName);
      formData.append("categoryType", categoryType);
      formData.append("isEnabled", "true");
      formData.append("image", {
        uri: categoryImage.uri,
        name: categoryImage.uri.split("/").pop(),
        type: "image/jpeg",
      });
      const response = await axios.post(
        `${SERVER_URL}/api/menu/createCategory`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const newCat = response.data;
      setCategories([
        ...categories,
        {
          _id: newCat._id,
          name: newCat.name,
          cateimage: newCat.cateimage,
          type: newCat.categoryType,
          items: [],
        },
      ]);
      setCategoryName("");
      setCategoryType("Veg");
      setCategoryImage(null);
    } catch (error) {
      Alert.alert("Error", "Failed to add category");
    }
  };

  const addItemToCategory = async () => {
    if (!selectedCategoryId || !itemName || !itemCost || !itemImage) {
      Alert.alert("Error", "All item fields are required.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("id", editData.id);
      formData.append("categoryId", editData.categoryId); // ✅ Add this
      formData.append("itemName", editData.name);
      formData.append("itemCost", parseFloat(editData.cost));
      formData.append("image", {
        uri: editData.image.uri,
        name: editData.image.uri.split("/").pop(),
        type: "image/jpeg",
      });
      await axios.post(`${SERVER_URL}/api/menu/addItemToCategory`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchMenu();
      setItemName("");
      setItemCost("");
      setItemImage(null);
      setShowItemModal(false);
    } catch (error) {
      Alert.alert("Error", "Failed to add item");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${SERVER_URL}/api/menu/deleteCategoryById/${id}`);
      fetchMenu();
    } catch (error) {
      Alert.alert("Error", "Failed to delete category");
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const category = categories.find((cat) =>
        cat.items.some((itm) => itm._id === itemId)
      );

      if (!category) {
        Alert.alert("Error", "Category not found for item");
        return;
      }

      await axios.delete(
        `${SERVER_URL}/api/menu/deleteItem/${category._id}/${itemId}`
      );
      fetchMenu();
    } catch (error) {
      Alert.alert("Error", "Failed to delete item");
    }
  };

  const findCategoryIdByItemId = (itemId) => {
    const category = categories.find((cat) =>
      cat.items.some((itm) => itm._id === itemId)
    );
    return category?._id || "";
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Add Category Form */}
      <View style={{ padding: 20, backgroundColor: "#6C4E31" }}>
        <TextInput
          placeholder="Enter Category Name"
          value={categoryName}
          onChangeText={setCategoryName}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={categoryType}
            onValueChange={(itemValue) => setCategoryType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Veg" value="Veg" />
            <Picker.Item label="Non-Veg" value="Non-Veg" />
          </Picker>
        </View>
        <TouchableOpacity
          style={styles.pickImageButton}
          onPress={pickCategoryImage}
        >
          <Text style={styles.pickImageText}>Pick Category Image</Text>
        </TouchableOpacity>
        {categoryImage && (
          <Image
            source={{ uri: categoryImage.uri }}
            style={styles.previewImage}
          />
        )}
        <TouchableOpacity style={styles.addButton} onPress={addCategory}>
          <Text style={styles.addButtonText}>Add Category</Text>
        </TouchableOpacity>
      </View>

      {/* Category & Items */}
      {categories.map((category) => (
        <View key={category._id} style={styles.categoryCard}>
          <View style={styles.categoryHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {category.cateimage && (
                <Image
                  source={{ uri: category.cateimage }}
                  style={styles.categoryImageInline}
                />
              )}
              <Text style={styles.categoryTitle}>{category.name}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setSelectedContext({ type: "category", id: category._id });
                setMenuOptionsVisible(true);
              }}
            >
              <Text style={styles.threeDots}>⋮</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setSelectedCategoryId(category._id);
              setShowItemModal(true);
            }}
          >
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>

          {category.items.map((item) => (
            <View key={item._id} style={styles.itemCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <Text style={styles.itemText}>
                {item.name} - ₹{item.cost}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedContext({ type: "item", id: item._id });
                  setMenuOptionsVisible(true);
                }}
                style={{ marginLeft: "auto" }}
              >
                <Text style={styles.threeDots}>⋮</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}

      {/* Menu Options Modal */}
      <Modal transparent visible={menuOptionsVisible} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuOptionsVisible(false)}
        >
          <View style={styles.popupMenu}>
            <TouchableOpacity
              onPress={() => {
                const category = categories.find(
                  (cat) => cat._id === selectedContext.id
                );
                const item = categories
                  .flatMap((cat) => cat.items)
                  .find((item) => item._id === selectedContext.id);

                if (selectedContext.type === "category" && category) {
                  setEditData({
                    type: "category",
                    id: category._id,
                    name: category.name,
                    typeValue: category.type,
                    image: { uri: category.cateimage },
                  });
                } else if (selectedContext.type === "item" && item) {
                  setEditData({
                    type: "item",
                    id: item._id,
                    name: item.name,
                    cost: item.cost.toString(),
                    image: { uri: item.image },
                  });
                }

                setMenuOptionsVisible(false);
                setShowEditModal(true);
              }}
            >
              <Text style={styles.popupText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (selectedContext.type === "category") {
                  deleteCategory(selectedContext.id);
                } else {
                  deleteItem(selectedContext.id);
                }
                setMenuOptionsVisible(false);
              }}
            >
              <Text style={styles.popupText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add Item Modal */}
      <Modal visible={showItemModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.subtitle}>Add Item</Text>
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
            <TouchableOpacity
              style={styles.pickImageButton}
              onPress={pickImage}
            >
              <Text style={styles.pickImageText}>Pick Item Image</Text>
            </TouchableOpacity>
            {itemImage && (
              <Image
                source={{ uri: itemImage.uri }}
                style={styles.previewImage}
              />
            )}
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={[styles.addButton, { flex: 1, marginRight: 5 }]}
                onPress={addItemToCategory}
              >
                <Text style={styles.addButtonText}>Add Item</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addButton, { flex: 1, marginLeft: 5 }]}
                onPress={() => {
                  setShowItemModal(false);
                  setItemName("");
                  setItemCost("");
                  setItemImage(null);
                  setSelectedCategoryId(null);
                }}
              >
                <Text style={styles.addButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.subtitle}>
              Edit {editData?.type === "category" ? "Category" : "Item"}
            </Text>
            <TextInput
              placeholder="Name"
              value={editData?.name || ""}
              onChangeText={(text) => setEditData({ ...editData, name: text })}
              style={styles.input}
            />

            {editData?.type === "item" && (
              <TextInput
                placeholder="Cost"
                value={editData?.cost || ""}
                onChangeText={(text) =>
                  setEditData({ ...editData, cost: text })
                }
                keyboardType="numeric"
                style={styles.input}
              />
            )}

            <TouchableOpacity
              style={styles.pickImageButton}
              onPress={async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 1,
                });
                if (!result.canceled) {
                  setEditData({ ...editData, image: result.assets[0] });
                }
              }}
            >
              <Text style={styles.pickImageText}>Pick Image</Text>
            </TouchableOpacity>

            {editData?.image && (
              <Image
                source={{ uri: editData.image.uri }}
                style={styles.previewImage}
              />
            )}

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={[styles.addButton, { flex: 1, marginRight: 5 }]}
                onPress={async () => {
                  const formData = new FormData();
                  formData.append("itemName", editData.name);
                  formData.append("itemCost", parseFloat(editData.cost));

                  if (editData.image && editData.image.uri) {
                    formData.append("image", {
                      uri: editData.image.uri,
                      name: editData.image.uri.split("/").pop(),
                      type: "image/jpeg",
                    });
                  }

                  try {
                    if (editData.type === "item") {
                      const categoryId = findCategoryIdByItemId(editData.id); // 👈 gets correct categoryId
                      const itemId = editData.id;

                      await axios.post(
                        `${SERVER_URL}/api/menu/updateItem/${categoryId}/${itemId}`,
                        formData,
                        {
                          headers: {
                            "Content-Type": "multipart/form-data",
                            "X-HTTP-Method-Override": "PUT", // optional signal for express
                          },
                        }
                      );
                    } else if (editData.type === "category") {
                      const categoryForm = new FormData();
                      categoryForm.append("id", editData.id);
                      categoryForm.append("name", editData.name);
                      categoryForm.append(
                        "categoryType",
                        editData.typeValue || "Veg"
                      );

                      if (editData.image && editData.image.uri) {
                        categoryForm.append("image", {
                          uri: editData.image.uri,
                          name: editData.image.uri.split("/").pop(),
                          type: "image/jpeg",
                        });
                      }

                      await axios.put(
                        `${SERVER_URL}/api/menu/updateCategoryById`,
                        categoryForm,
                        {
                          headers: {
                            "Content-Type": "multipart/form-data",
                          },
                        }
                      );
                    }

                    fetchMenu();
                    setShowEditModal(false);
                    setEditData(null);
                  } catch (err) {
                    Alert.alert("Error", "Update failed");
                    console.error(err);
                  }
                }}
              >
                <Text style={styles.addButtonText}>Update</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.addButton, { flex: 1, marginLeft: 5 }]}
                onPress={() => {
                  setShowEditModal(false);
                  setEditData(null);
                }}
              >
                <Text style={styles.addButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fdfbf7",
    flexGrow: 1,
  },
  input: {
    backgroundColor: "#fff7ec",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0d4c1",
  },
  pickerWrapper: {
    backgroundColor: "#fff7ec",
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0d4c1",
    height: 50,
    justifyContent: "center",
  },
  picker: {
    color: "#6C4E31",
    height: 50,
  },
  pickImageButton: {
    backgroundColor: "#ffe0b2",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  pickImageText: {
    color: "#4a3622",
    fontWeight: "600",
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: "center",
  },
  addButton: {
    backgroundColor: "#6C4E31",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  categoryCard: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginLeft: 10,
  },
  categoryImageInline: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: "cover",
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff8eb",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  itemImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  itemText: {
    fontSize: 15,
    color: "#333",
    flexShrink: 1,
  },
  threeDots: {
    fontSize: 22,
    color: "#6C4E31",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  subtitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
  },
  popupMenu: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderRadius: 8,
    position: "absolute",
    top: "40%",
    right: 20,
    elevation: 5,
    width: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  popupText: {
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: "#333",
    textAlign: "left",
  },
});

export default ManageMenu;
