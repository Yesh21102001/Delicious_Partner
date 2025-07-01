import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { height } = Dimensions.get("window");

const BASE_URL = "http://192.168.29.186:2000/api/order"; // Use your IP

const OrderSummary = ({ route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [showNumber, setShowNumber] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`${BASE_URL}/${orderId}`);
      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", "Failed to fetch order details");
        return;
      }

      setOrder(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order:", error);
      Alert.alert("Error", "Something went wrong");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#603F26" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red", fontSize: 18 }}>Order not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBanner}>
        <Text style={styles.orderIdText}>#{order.orderId}</Text>
        <Text style={styles.customerNameText}>Customer ID: {order.userId}</Text>
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.dropButton}>
          <Text style={styles.dropButtonText}>GO TO DROP</Text>
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderIdSmall}>#{order.orderId}</Text>
            <Text style={styles.orderTime}>
              {new Date(order.createdAt).toLocaleTimeString()}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items Ordered</Text>
            {order.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>x {item.quantity}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={20} color="red" />
              <Text style={styles.detailText}>{order.deliveryLocation}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => setShowNumber(!showNumber)}
            >
              <Text style={styles.callButtonText}>Call Customer</Text>
            </TouchableOpacity>

            {showNumber && (
              <Text style={styles.contactNumber}>+91 9876543210</Text>
              // Replace with actual number when available
            )}
          </View>

          <View style={styles.amountSection}>
            <Text style={styles.paidText}>
              Amount Paid: ₹{order.total}
            </Text>
          </View>
        </ScrollView>
      </View>

      <View style={styles.deliveredButtonContainer}>
        <TouchableOpacity style={styles.deliveredButton}>
          <Text style={styles.deliveredButtonText}>DELIVERED</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  topBanner: {
    height: height * 0.22,
    backgroundColor: "#603F26",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  orderIdText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
  },
  customerNameText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 30,
    elevation: 5,
  },
  dropButton: {
    backgroundColor: "#FFDBB5",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    width: 200,
    alignSelf: "center",
  },
  dropButtonText: {
    color: "#603F26",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  scrollContent: { paddingBottom: 30 },
  orderInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  orderIdSmall: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderTime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  section: { marginTop: 15 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  itemName: { fontSize: 16, color: "#555" },
  itemQuantity: { fontSize: 16, fontWeight: "bold", color: "#333" },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  detailText: {
    fontSize: 17,
    marginLeft: 5,
    fontWeight: "600",
    color: "#444",
  },
  callButton: {
    backgroundColor: "#603F26",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  callButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  contactNumber: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
  },
  amountSection: {
    marginTop: 30,
    alignItems: "center",
  },
  paidText: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },
  deliveredButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  deliveredButton: {
    backgroundColor: "#603F26",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  deliveredButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrderSummary;
