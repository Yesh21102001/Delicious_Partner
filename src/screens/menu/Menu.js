import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import axios from "axios";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Menu = ({ restaurantOnline, setRestaurantOnline }) => {
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get(
        "http://192.168.29.186:2000/api/menu/getMenu"
      );
      const data = response.data;

      const formatted = data.map((category) => ({
        _id: category._id,
        name: category.name,
        cateimage: category.cateimage,
        isEnabled: category.isEnabled ?? true,
        items: Array.isArray(category.items)
          ? category.items.map((item) => ({
              _id: item._id,
              itemName: item.itemName,
              image: item.image,
              isEnabled: item.isEnabled ?? true,
            }))
          : [],
      }));

      setCategories(formatted);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!restaurantOnline) {
      setCategories((prev) =>
        prev.map((category) => ({
          ...category,
          isEnabled: false,
          items: category.items.map((item) => ({ ...item, isEnabled: false })),
        }))
      );
    }
  }, [restaurantOnline]);

  const toggleCategorySwitch = async (categoryId) => {
  try {
    await axios.patch(`http://192.168.29.186:2000/api/menu/toggleCategory/${categoryId}`);
    fetchMenu();
  } catch (error) {
    console.error("Error toggling category:", error);
  }
};

const toggleItem = async (categoryId, itemId) => {
  try {
    await axios.patch(`http://192.168.29.186:2000/api/menu/toggleItem/${categoryId}/${itemId}`);
    fetchMenu();
  } catch (error) {
    console.error("Error toggling item:", error);
  }
};


  // const toggleCategorySwitch = (categoryId) => {
  //   setCategories((prev) =>
  //     prev.map((category) =>
  //       category._id === categoryId
  //         ? {
  //             ...category,
  //             isEnabled: !category.isEnabled,
  //             items: category.items.map((item) => ({
  //               ...item,
  //               isEnabled: !category.isEnabled,
  //             })),
  //           }
  //         : category
  //     )
  //   );
  // };

  // const toggleItem = (categoryId, itemId) => {
  //   setCategories((prev) =>
  //     prev.map((category) =>
  //       category._id === categoryId
  //         ? {
  //             ...category,
  //             items: category.items.map((item) =>
  //               item._id === itemId
  //                 ? { ...item, isEnabled: !item.isEnabled }
  //                 : item
  //             ),
  //           }
  //         : category
  //     )
  //   );
  // };

  const toggleExpandCategory = (categoryId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading menu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.restaurantSwitch}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          Restaurant is {restaurantOnline ? "Online" : "Offline"}
        </Text>
        <Switch
          value={restaurantOnline}
          onValueChange={setRestaurantOnline}
          trackColor={{ false: "#ddd", true: "green" }}
          thumbColor={restaurantOnline ? "#fff" : "#f4f4f4"}
        />
      </View>

      <FlatList
        data={categories}
        keyExtractor={(category) => category._id}
        renderItem={({ item: category }) => {
          const isExpanded = expandedCategories[category._id];
          return (
            <View style={styles.categoryCard}>
              <TouchableOpacity
                onPress={() => toggleExpandCategory(category._id)}
                style={styles.categoryHeader}
                activeOpacity={0.8}
              >
                <View style={styles.categoryInfo}>
                  {category.cateimage && (
                    <Image
                      source={{ uri: category.cateimage }}
                      style={styles.categoryImageInline}
                    />
                  )}
                  <Text style={styles.categoryText}>{category.name}</Text>
                </View>
                <Switch
                  value={category.isEnabled}
                  onValueChange={() => toggleCategorySwitch(category._id)}
                  disabled={!restaurantOnline}
                  trackColor={{ false: "#ddd", true: "green" }}
                  thumbColor={category.isEnabled ? "#fff" : "#f4f4f4"}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View>
                  {category.items.map((item) => (
                    <View
                      key={item._id}
                      style={[
                        styles.itemRow,
                        !category.isEnabled && styles.disabledItem,
                      ]}
                    >
                      {item.image && (
                        <Image
                          source={{ uri: item.image }}
                          style={styles.itemImage}
                        />
                      )}
                      <Text
                        style={[
                          styles.itemText,
                          (!category.isEnabled || !item.isEnabled) &&
                            styles.disabledText,
                        ]}
                      >
                        {item.itemName}
                      </Text>
                      <Switch
                        value={item.isEnabled}
                        onValueChange={() => toggleItem(category._id, item._id)}
                        disabled={!restaurantOnline || !category.isEnabled}
                        trackColor={{ false: "#ccc", true: "green" }}
                        thumbColor={item.isEnabled ? "#fff" : "#f4f4f4"}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  restaurantSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#F3F1F5",
    borderRadius: 10,
  },
  categoryCard: {
    backgroundColor: "#FFDBB5",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryImageInline: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    color: "#444",
    flex: 1,
    fontWeight: "bold",
  },
  disabledText: {
    color: "gray",
  },
  disabledItem: {
    opacity: 0.5,
  },
});

export default Menu;
