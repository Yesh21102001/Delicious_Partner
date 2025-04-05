import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, FlatList, Image } from 'react-native';

const Menu = () => {
  const [categories, setCategories] = useState([
    { 
      id: '1', 
      name: 'Veg Biryanis', 
      isEnabled: true, 
      items: [
        { id: '1-1', name: 'Paneer Butter Masala', image: 'https://img.freepik.com/free-photo/pre-prepared-food-showcasing-ready-eat-delicious-meals-go_23-2151246078.jpg?t=st=1742365165~exp=1742368765~hmac=6320b1d04b12d09386ce2a7d34d5b43ba40bd0ee7e8d1813d2aa58994febf911&w=1380', isEnabled: true },
        { id: '1-2', name: 'Veg Biryani', image: 'https://img.freepik.com/free-psd/delicious-mutton-biryani-aromatic-rice-dish-indian-cuisine_84443-45803.jpg?t=st=1742365258~exp=1742368858~hmac=3de9e6de99ef0eb92166b4f2367a0d7c2fe57148e5c8c32b99ab03b6eb0b0725&w=826', isEnabled: true },
        { id: '1-3', name: 'Mushroom Biryani', image: 'https://img.freepik.com/free-photo/mushroom-biryani_1339-9576.jpg', isEnabled: true },
        { id: '1-4', name: 'Mixed Veg Biryani', image: 'https://img.freepik.com/free-photo/mixed-veg-biryani_1339-9544.jpg', isEnabled: true }
      ]
    },
    { 
      id: '2', 
      name: 'Non-Veg Biryanis', 
      isEnabled: true, 
      items: [
        { id: '2-1', name: 'Chicken Biryani', image: 'https://img.freepik.com/free-photo/delicious-chicken-biryani-bowl_123827-20287.jpg', isEnabled: true },
        { id: '2-2', name: 'Mutton Biryani', image: 'https://img.freepik.com/free-photo/mutton-biryani-dish_1339-9815.jpg', isEnabled: true },
        { id: '2-3', name: 'Fish Biryani', image: 'https://img.freepik.com/free-photo/fish-biryani_1339-9874.jpg', isEnabled: true },
        { id: '2-4', name: 'Chicken Joint Biryani', image: 'https://img.freepik.com/free-photo/chicken-joint-biryani_1339-9825.jpg', isEnabled: true }
      ]
    }
  ]);

  const toggleCategory = (categoryId) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId
          ? { 
              ...category, 
              isEnabled: !category.isEnabled,
              items: category.items.map(item => ({ ...item, isEnabled: !category.isEnabled })) 
            }
          : category
      )
    );
  };

  const toggleItem = (categoryId, itemId) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId
          ? { 
              ...category, 
              items: category.items.map((item) =>
                item.id === itemId ? { ...item, isEnabled: !item.isEnabled } : item
              ) 
            }
          : category
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Menu</Text>
      <FlatList
        data={categories}
        keyExtractor={(category) => category.id}
        renderItem={({ item: category }) => (
          <View style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryText}>{category.name}</Text>
              <Switch
                value={category.isEnabled}
                onValueChange={() => toggleCategory(category.id)}
                trackColor={{ false: '#ddd', true: '#4CAF50' }}
                thumbColor={category.isEnabled ? '#fff' : '#f4f4f4'}
              />
            </View>
            <FlatList
              data={category.items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={[styles.itemRow, !category.isEnabled && styles.disabledItem]}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <Text style={[styles.itemText, !category.isEnabled && styles.disabledText]}>
                    {item.name}
                  </Text>
                  <Switch
                    value={item.isEnabled}
                    onValueChange={() => toggleItem(category.id, item.id)}
                    disabled={!category.isEnabled}
                    trackColor={{ false: '#ccc', true: '#4CAF50' }}
                    thumbColor={item.isEnabled ? '#fff' : '#f4f4f4'}
                  />
                </View>
              )}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#444',
    flex: 1,
  },
  disabledText: {
    color: 'gray',
  },
  disabledItem: {
    opacity: 0.5,
  },
});

export default Menu;
