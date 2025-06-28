import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { height } = Dimensions.get("window");

const dummyOrder = {
  orderId: "#12345",
  customerName: "John Doe",
  orderTime: "12:30 PM",
  itemsOrdered: [
    { name: "Chicken Biryani", quantity: 2 },
    { name: "Paneer Butter Masala", quantity: 1 },
    { name: "Butter Naan", quantity: 3 },
  ],
  location: "12-82, Ganesh Nagar, Madhuruwada, Visakhapatnam, 530048",
  contactNumber: "+91 9876543210",
  paymentType: "Paid",
  totalAmount: 750,
};

const OrderSummary = ({ order }) => {
  const orderData = order || dummyOrder;
  const [showNumber, setShowNumber] = useState(false);

  return (
    <View style={styles.container}>
      {/* Top #603F26 Background */}
      <View style={styles.topBanner}>
        <Text style={styles.orderIdText}>{orderData.orderId}</Text>
        <Text style={styles.customerNameText}>{orderData.customerName}</Text>
      </View>

      {/* Card Section */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.dropButton}>
          <Text style={styles.dropButtonText}>GO TO DROP</Text>
        </TouchableOpacity>

        {/* Scrollable Details */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Order ID and Time */}
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderIdSmall}>{orderData.orderId}</Text>
            <Text style={styles.orderTime}>{orderData.orderTime}</Text>
          </View>

          {/* Items Ordered */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items Ordered</Text>
            {orderData.itemsOrdered.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>x {item.quantity}</Text>
              </View>
            ))}
          </View>

          {/* Location */}
          <View style={styles.section}>
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={20} color="red" />
              <Text style={styles.detailText}>{orderData.location}</Text>
            </View>
          </View>

          {/* Call Button */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => setShowNumber(!showNumber)}
            >
              <Text style={styles.callButtonText}>Call Customer</Text>
            </TouchableOpacity>

            {showNumber && (
              <Text style={styles.contactNumber}>{orderData.contactNumber}</Text>
            )}
          </View>

          {/* Amount */}
          <View style={styles.amountSection}>
            {orderData.paymentType === "Paid" ? (
              <Text style={styles.paidText}>Amount Paid: ₹{orderData.totalAmount}</Text>
            ) : (
              <Text style={styles.codText}>Amount to Pay: ₹{orderData.totalAmount}</Text>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Delivered Button */}
      <View style={styles.deliveredButtonContainer}>
        <TouchableOpacity style={styles.deliveredButton}>
          <Text style={styles.deliveredButtonText}>DELIVERED</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
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
  scrollContent: {
    paddingBottom: 30,
  },
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
  section: {
    marginTop: 15,
  },
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
  itemName: {
    fontSize: 16,
    color: "#555",
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    padding: "5",
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
  codText: {
    fontSize: 18,
    color: "red",
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
});

export default OrderSummary;