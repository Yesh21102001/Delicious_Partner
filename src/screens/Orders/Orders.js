import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const BASE_URL = "http://192.168.29.186:2000/api/order";

const Orders = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [filter, setFilter] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/getAllOrders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateObj) => {
    const d = new Date(dateObj);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const selectedDateStr = formatDate(selectedDate);

  const filteredOrders = orders.filter((order) => {
    const orderDateStr = formatDate(order.createdAt);
    const statusMatch = filter === "All" || order.status === filter;
    const dateMatch = orderDateStr === selectedDateStr;
    return statusMatch && dateMatch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setShowPicker(true)}>
          <Text style={styles.buttonText}>{selectedDateStr}</Text>
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
          <Picker selectedValue={filter} onValueChange={(itemValue) => setFilter(itemValue)}>
            <Picker.Item label="All" value="All" />
            <Picker.Item label="Ordered" value="Ordered" />
            <Picker.Item label="Preparing" value="Preparing" />
            <Picker.Item label="Ready" value="Ready" />
            <Picker.Item label="Picked Up" value="Picked Up" />
            <Picker.Item label="Delivered" value="Delivered" />
            <Picker.Item label="Rejected" value="Rejected" />
            <Picker.Item label="Cancelled" value="Cancelled" />
          </Picker>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#603F26" />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <View
                style={[
                  styles.statusContainer,
                  {
                    backgroundColor:
                      item.status === "Delivered"
                        ? "green"
                        : item.status === "Pending" || item.status === "Preparing"
                        ? "orange"
                        : item.status === "Cancelled" || item.status === "Rejected"
                        ? "red"
                        : "#603F26",
                  },
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
              <Text style={styles.timeText}>
                {new Date(item.createdAt).toLocaleTimeString()} | {formatDate(item.createdAt)}
              </Text>

              <View style={styles.orderRow}>
                <Text style={styles.orderIdText}>Order ID: #{item.orderId}</Text>
                <Text style={styles.customerText}>User: {item.userId}</Text>
              </View>

              <View style={styles.orderRow}>
                <Text style={styles.itemText}>{item.items[0]?.name}</Text>
                <Text style={styles.priceText}>₹{item.total}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No orders found for selected date and filter</Text>
          }
        />
      )}
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
