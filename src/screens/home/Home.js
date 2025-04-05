import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Preparing");
  const [prepTimes, setPrepTimes] = useState({});
  const [newOrderCount, setNewOrderCount] = useState(0);

  useEffect(() => {
    const orderTimer = setInterval(() => {
      const newOrder = {
        orderId: `ORD${Math.floor(Math.random() * 10000)}`,
        timePlaced: new Date().toLocaleTimeString(),
        customerName: "John Doe",
        items: [
          { name: "Chicken Biryani", quantity: 1, price: 250 },
          { name: "Butter Naan", quantity: 2, price: 40 },
        ],
        totalAmount: 330,
        status: "New",
      };
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      setNewOrderCount((prev) => prev + 1);
    }, 10000);

    return () => clearInterval(orderTimer);
  }, []);

  const handleAccept = (orderId) => {
    const prepTime = prepTimes[orderId] || 20; // Default to 20 minutes

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId
          ? { ...order, status: "Preparing", prepTime } // Store prep time
          : order
      )
    );

    setNewOrderCount((prev) => {
      const updatedCount = Math.max(prev - 1, 0);
      if (updatedCount === 0) {
        setSelectedStatus("Preparing");
      }
      return updatedCount;
    });
  };

  const handleTimeChange = (orderId, change) => {
    setPrepTimes((prevTimes) => {
      const currentTime = prevTimes[orderId] || 20;
      const newTime = Math.max(20, currentTime + change);
      return { ...prevTimes, [orderId]: newTime };
    });
  };

  const handleReject = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.orderId !== orderId)
    );
    setNewOrderCount((prev) => Math.max(prev - 1, 0));
  };

  const handleMoveToNextStatus = (orderId, currentStatus) => {
    const nextStatus =
      currentStatus === "Preparing"
        ? "Ready"
        : currentStatus === "Ready"
        ? "Picked Up"
        : null;

    if (nextStatus) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: nextStatus } : order
        )
      );
      setSelectedStatus(nextStatus);
    }
  };

  const filteredOrders = orders.filter(
    (order) => order.status === selectedStatus
  );

  return (
    <View style={styles.container}>
      {/* Status Filter Buttons */}
      <View style={styles.statusContainer}>
        {["Preparing", "Ready", "Picked Up"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusButton,
              selectedStatus === status && styles.activeStatus,
            ]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text
              style={[
                styles.statusText,
                selectedStatus === status && styles.whiteText,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.orderId}
        renderItem={({ item }) => (
          <View style={styles.orderContainer}>
            {/* Order ID and Time */}
            <View style={styles.rowContainer}>
              <Text style={styles.boldText}>Order ID: {item.orderId}</Text>
              <Text style={styles.boldText}>Time: {item.timePlaced}</Text>
            </View>

            {/* Customer Name */}
            <Text style={styles.customerName}>
              Customer: {item.customerName}
            </Text>

            {/* Order Items */}
            {item.items.map((orderItem, index) => (
              <View key={index} style={styles.rowContainer}>
                <Text style={styles.itemText}>
                  {orderItem.quantity} x {orderItem.name}
                </Text>
                <Text style={styles.itemText}>
                  ₹{orderItem.price * orderItem.quantity}
                </Text>
              </View>
            ))}

            {/* Total Amount */}
            <Text style={styles.totalAmount}>Total: ₹{item.totalAmount}</Text>

            {/* Preparation Time Selector (only for New Orders) */}
            {item.status === "New" && (
              <View style={styles.timeSelector}>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => handleTimeChange(item.orderId, -1)}
                >
                  <Text style={styles.Text}>-</Text>
                </TouchableOpacity>

                <Text style={styles.timeText}>
                  {prepTimes[item.orderId] || 20} min
                </Text>

                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => handleTimeChange(item.orderId, 1)}
                >
                  <Text style={styles.Text}>+</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {item.status === "New" ? (
                <>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleReject(item.orderId)}
                  >
                    <Text style={styles.whiteText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAccept(item.orderId)}
                  >
                    <Text style={styles.whiteText}>Accept</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.nextStageButton}
                  onPress={() =>
                    handleMoveToNextStatus(item.orderId, item.status)
                  }
                >
                  <Text style={styles.whiteText}>
                    {item.status === "Preparing"
                      ? "Mark Ready"
                      : "Mark Picked Up"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noOrdersText}>No Orders in {selectedStatus}</Text>
        }
      />

      {/* New Order Notification Button */}
      {newOrderCount > 0 && (
        <TouchableOpacity
          style={styles.newOrderButton}
          onPress={() => setSelectedStatus("New")}
        >
          <Icon name="bell" size={30} color="white" />
          <Text style={styles.whiteText}>{newOrderCount} New Order(s)!</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f1f6",
    paddingTop: 40,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  statusButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeStatus: {
    backgroundColor: "#4CAF50",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  whiteText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  Text: {
    color: "#4CAF50",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 24,
  },
  noOrdersText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  orderContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  customerName: {
    fontSize: 16,
    marginVertical: 5,
  },
  itemText: {
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  rejectButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  nextStageButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  newOrderButton: {
    backgroundColor: "#4CAF50",
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
  },
  timeSelector: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    color: "black"
  },
  timeButton: {
    borderWidth: 2,       // Defines the border thickness
    borderColor: '#4CAF50', // Defines the border color
    borderStyle: 'solid',
    padding: 10,
    fontSize: 20,
    borderRadius: 5,
    marginHorizontal: 5,
    color: "black"
  },
  timeText: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#4CAF50",
    color: "white",
    paddingLeft: 80,
    paddingRight: 80,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 5,
  },
  timeButtonText: {
    fontSize: 28,  
    fontWeight: "bold",
    color: "black", 
  },
});

export default Home;
