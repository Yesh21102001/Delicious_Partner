import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const Orders = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [filter, setFilter] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);

  const orders = [
    { id: "1", date: "2025-03-24", time: "12:30 PM", item: "Burger", price: 150, status: "Delivered", customer: "John Doe" },
    { id: "2", date: "2025-03-24", time: "01:15 PM", item: "Pizza", price: 300, status: "Pending", customer: "Jane Smith" },
    { id: "3", date: "2025-03-23", time: "02:45 PM", item: "Pasta", price: 200, status: "Cancelled", customer: "David Lee" },
    { id: "4", date: "2025-03-22", time: "11:00 AM", item: "Sandwich", price: 100, status: "Delivered", customer: "Emily Clark" },
  ];

  const filteredOrders = filter === "All" ? orders : orders.filter(order => order.status === filter);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setShowPicker(true)}>
          <Text style={styles.buttonText}>{selectedDate.toISOString().split("T")[0]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setShowDropdown(!showDropdown)}>
          <Text style={styles.buttonText}>Filters</Text>
        </TouchableOpacity>
      </View>
      
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      {showDropdown && (
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={filter}
            onValueChange={(itemValue) => setFilter(itemValue)}>
            <Picker.Item label="All" value="All" />
            <Picker.Item label="Delivered" value="Delivered" />
            <Picker.Item label="Pending" value="Pending" />
            <Picker.Item label="Cancelled" value="Cancelled" />
          </Picker>
        </View>
      )}

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <View style={[styles.statusContainer, {
              backgroundColor: item.status === "Delivered" ? "green" : item.status === "Pending" ? "orange" : "red"
            }]}>  
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <Text style={styles.timeText}>{item.time} | {item.date}</Text>
            
            <View style={styles.orderRow}>
              <Text style={styles.orderIdText}>Order ID: {item.id}</Text>
              <Text style={styles.customerText}>{item.customer}</Text>
            </View>

            <View style={styles.orderRow}>
              <Text style={styles.itemText}>{item.item}</Text>
              <Text style={styles.priceText}>₹{item.price}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No orders found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#603F26",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "45%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownContainer: {
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    padding: 5,
  },
  orderItem: {
    padding: 15,
    backgroundColor: "#f8f8f8",
    marginVertical: 5,
    borderRadius: 5,
  },
  statusContainer: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 3,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 14,
    color: "black",
    textAlign: "right",
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  orderIdText: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },
  customerText: {
    fontSize: 14,
    color: "gray",
  },
  itemText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});

export default Orders;