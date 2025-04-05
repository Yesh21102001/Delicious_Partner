import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ManageMenu = () => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
    const [itemName, setItemName] = useState('');
    const [itemCost, setItemCost] = useState('');

    const addCategory = () => {
        if (categoryName) {
            setCategories([...categories, { name: categoryName, items: [] }]);
            setCategoryName('');
        }
    };

    const addItemToCategory = () => {
        if (selectedCategoryIndex !== null && itemName && itemCost) {
            const updatedCategories = categories.map((category, index) => {
                if (index === selectedCategoryIndex) {
                    return {
                        ...category,
                        items: [...category.items, { name: itemName, cost: itemCost }]
                    };
                }
                return category;
            });
            setCategories(updatedCategories);
            setItemName('');
            setItemCost('');
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
                    <Ionicons name="add-circle" size={32} color="#4CAF50" />
                </TouchableOpacity>
            </View>

            {categories.map((category, index) => (
                <View key={index} style={styles.categoryCard}>
                    <TouchableOpacity onPress={() => setSelectedCategoryIndex(index)}>
                        <Text style={[styles.categoryTitle, selectedCategoryIndex === index && styles.selectedCategory]}>
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                    {category.items.map((menuItem, idx) => (
                        <View key={idx} style={styles.itemCard}>
                            <Text style={styles.itemText}>{menuItem.name} - ₹{menuItem.cost}</Text>
                        </View>
                    ))}
                </View>
            ))}

            {selectedCategoryIndex !== null && (
                <View style={styles.itemInputContainer}>
                    <Text style={styles.subtitle}>Add Item to {categories[selectedCategoryIndex]?.name}</Text>
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
                    <TouchableOpacity style={styles.button} onPress={addItemToCategory}>
                        <Text style={styles.buttonText}>Add Item</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#333' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 10, marginBottom: 10 },
    input: { flex: 1, padding: 15, borderRadius: 5, backgroundColor: '#eef2f3', marginRight: 10, marginBottom: 10 },
    addButton: { justifyContent: 'center', alignItems: 'center' },
    categoryCard: { padding: 15, backgroundColor: '#fff', borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#ddd', elevation: 2 },
    categoryTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#333' },
    selectedCategory: { color: '#4CAF50' },
    itemCard: { padding: 10, borderRadius: 5, backgroundColor: '#f8f8f8', marginVertical: 5, borderWidth: 1, borderColor: '#eee' },
    itemText: { fontSize: 18, color: '#555' },
    itemInputContainer: { marginTop: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10 },
    button: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 5, alignItems: 'center', width: 345 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    subtitle : {marginBottom: 10}
});

export default ManageMenu;