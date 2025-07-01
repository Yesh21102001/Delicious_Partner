import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const BASE_URL = "http://192.168.29.186:2000/api/order"; // use your IP

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Preparing");
  const [prepTimes, setPrepTimes] = useState({});
  const [prepCountdowns, setPrepCountdowns] = useState({});
  const [newOrderCount, setNewOrderCount] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrepCountdowns((prev) => {
        const updated = { ...prev };
        for (const orderId in updated) {
          if (updated[orderId] > 0) {
            updated[orderId] -= 1;
          }
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getAllOrders`);
      const data = await response.json();
      if (!response.ok) return;

      setOrders(data);

      const newOrders = data.filter((order) => order.status === "Ordered");
      setNewOrderCount(newOrders.length);

      const preparingOrders = data.filter(
        (order) => order.status === "Preparing"
      );
      const countdowns = {};
      preparingOrders.forEach((order) => {
        if (!prepCountdowns[order.orderId]) {
          countdowns[order.orderId] = (prepTimes[order.orderId] || 20) * 60;
        }
      });
      setPrepCountdowns((prev) => ({ ...prev, ...countdowns }));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleTimeChange = (orderId, change) => {
    setPrepTimes((prevTimes) => {
      const currentTime = prevTimes[orderId] || 20;
      const newTime = Math.max(5, currentTime + change);
      return { ...prevTimes, [orderId]: newTime };
    });
  };

  const handleAccept = async (orderId) => {
    const prepTime = prepTimes[orderId] || 20;

    try {
      const res = await fetch(
        `${BASE_URL}/adminStatusUpdate/${orderId}/Preparing`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prepTime }),
        }
      );

      if (res.ok) {
        setPrepCountdowns((prev) => ({
          ...prev,
          [orderId]: prepTime * 60,
        }));
        fetchOrders();
        setSelectedStatus("Preparing");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (orderId) => {
    try {
      await fetch(`${BASE_URL}/adminStatusUpdate/${orderId}/Rejected`, {
        method: "POST",
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveToNextStatus = async (orderId, currentStatus) => {
    let nextStatus =
      currentStatus === "Preparing"
        ? "Ready"
        : currentStatus === "Ready"
        ? "Picked Up" // 👈 match the schema exactly
        : currentStatus === "Picked Up"
        ? "Delivered"
        : null;

    if (!nextStatus) return;

    try {
      await fetch(`${BASE_URL}/adminStatusUpdate/${orderId}/${nextStatus}`, {
        method: "POST",
      });
      fetchOrders();
      setSelectedStatus(nextStatus);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCardPress = (item) => {
    if (item.status === "Picked Up") {
      navigation.navigate("OrderSummary", { orderId: item.orderId });
    }
  };

  const formatCountdown = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const filteredOrders = orders.filter(
    (order) => order.status === selectedStatus
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="dark-content" />
      <View style={styles.statusContainer}>
        {["Preparing", "Ready", "Picked Up", "Delivered"].map((status) => (
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

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.orderId}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleCardPress(item)}
            disabled={item.status !== "Picked Up"}
          >
            <View style={styles.orderContainer}>
              {/* Prep Time Badge & Order ID */}
              {item.status === "Preparing" && (
                <View style={styles.prepHeader}>
                  <View style={styles.timerBadge}>
                    <Text style={styles.timerText}>
                      {formatCountdown(prepCountdowns[item.orderId] || 0)}
                    </Text>
                  </View>
                  <Text style={styles.OrderText}>#{item.orderId}</Text>
                </View>
              )}

              {item.status !== "Preparing" && (
                <View style={styles.readyPickedHeader}>
                  <Text style={styles.boldText}>#{item.orderId}</Text>
                  <Text style={styles.boldText}>
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </Text>
                </View>
              )}

              {item.items.map((orderItem, index) => (
                <View key={index} style={styles.rowContainer}>
                  <Text style={styles.itemText}>
                    {orderItem.quantity} x {orderItem.name}
                  </Text>
                  <Text style={styles.itemText}>
                    ₹{orderItem.cost * orderItem.quantity}
                  </Text>
                </View>
              ))}

              <Text style={styles.totalAmount}>Total: ₹{item.total}</Text>

              <View style={styles.locationRow}>
                <Icon name="map-marker" size={25} color="red" />
                <Text style={styles.locationText}>{item.deliveryLocation}</Text>
              </View>

              {item.status === "Ordered" && (
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

              <View style={styles.buttonContainer}>
                {item.status === "Ordered" ? (
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
                ) : item.status === "Delevered" ? (
                  <View style={styles.deliveredBadge}>
                    <Text style={styles.whiteText}>Delivered</Text>
                  </View>
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
                        : item.status === "Ready"
                        ? "Mark Picked Up"
                        : item.status === "Picked Up"
                        ? "Mark Delivered"
                        : null}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noOrdersText}>No Orders in {selectedStatus}</Text>
        }
      />

      {newOrderCount > 0 && (
        <TouchableOpacity
          style={styles.newOrderButton}
          onPress={() => setSelectedStatus("Ordered")}
        >
          <Icon name="bell" size={30} color="white" />
          <Text style={styles.whiteText}>{newOrderCount} New Order(s)!</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ⬇ Add these styles below your existing StyleSheet
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f1f6", paddingTop: 40 },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  statusButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeStatus: {
    backgroundColor: "#603F26",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#603F26",
  },
  whiteText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  Text: {
    color: "#603F26",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 24,
  },
  noOrdersText: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 20,
  },
  orderContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    alignSelf: "center",
    marginBottom: 10,
    elevation: 4,
    position: "relative",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  readyPickedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  boldText: { fontWeight: "bold", fontSize: 18 },
  itemText: { fontSize: 16 },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  locationText: { marginLeft: 5, fontSize: 16 },
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
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  nextStageButton: {
    backgroundColor: "#603F26",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  deliveredBadge: {
    backgroundColor: "green",
    padding: 8,
    borderRadius: 15,
    alignItems: "center",
  },
  newOrderButton: {
    backgroundColor: "green",
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  timeSelector: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  timeButton: {
    borderWidth: 2,
    borderColor: "#603F26",
    borderStyle: "solid",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  timeText: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#603F26",
    color: "white",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 5,
  },

  prepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  timerBadge: {
    backgroundColor: "orange",
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  OrderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Home;
