import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Preparing");
  const [prepTimes, setPrepTimes] = useState({});
  const [prepCountdowns, setPrepCountdowns] = useState({});
  const [newOrderCount, setNewOrderCount] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    const orderTimer = setInterval(() => {
      const newOrder = {
        orderId: `ORD${Math.floor(Math.random() * 10000)}`,
        timePlaced: new Date().toLocaleTimeString(),
        items: [
          { name: "Chicken Biryani", quantity: 1, price: 250 },
          { name: "Butter Naan", quantity: 2, price: 40 },
        ],
        totalAmount: 330,
        status: "New",
        location: "Downtown Street, City Name",
      };
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      setNewOrderCount((prev) => prev + 1);
    }, 10000);

    return () => clearInterval(orderTimer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrepCountdowns((prevCountdowns) => {
        const updated = { ...prevCountdowns };
        Object.keys(updated).forEach((orderId) => {
          updated[orderId] -= 1;
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = (orderId) => {
    const prepTime = prepTimes[orderId] || 20;
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId
          ? { ...order, status: "Preparing", prepTime }
          : order
      )
    );

    setPrepCountdowns((prev) => ({
      ...prev,
      [orderId]: prepTime * 60,
    }));

    setNewOrderCount((prev) => {
      const updatedCount = Math.max(prev - 1, 0);
      if (updatedCount === 0) {
        setSelectedStatus("Preparing");
      }
      return updatedCount;
    });
  };

  const handleReject = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.orderId !== orderId)
    );
    setNewOrderCount((prev) => Math.max(prev - 1, 0));
  };

  const handleTimeChange = (orderId, change) => {
    setPrepTimes((prevTimes) => {
      const currentTime = prevTimes[orderId] || 20;
      const newTime = Math.max(20, currentTime + change);
      return { ...prevTimes, [orderId]: newTime };
    });
  };

  const handleMoveToNextStatus = (orderId, currentStatus) => {
    let nextStatus =
      currentStatus === "Preparing"
        ? "Ready"
        : currentStatus === "Ready"
        ? "Picked Up"
        : currentStatus === "Picked Up"
        ? "Delivered"
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

  const handleCardPress = (item) => {
    if (item.status === "Picked Up") {
      navigation.navigate("OrderSummary", { order: item });
    }
  };

  const filteredOrders = orders.filter(
    (order) => order.status === selectedStatus
  );

  return (
    <View style={styles.container}>
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
              <View style={styles.headerRow}>
                {item.status === "Preparing" ? (
                  <>
                    <View style={styles.timerBadge}>
                      <Text style={styles.timerBadgeText}>
                        {prepCountdowns[item.orderId] >= 0
                          ? `${Math.floor(prepCountdowns[item.orderId] / 60)}:${String(
                              prepCountdowns[item.orderId] % 60
                            ).padStart(2, "0")}`
                          : `+${Math.abs(Math.floor(prepCountdowns[item.orderId] / 60))}:${String(
                              Math.abs(prepCountdowns[item.orderId] % 60)
                            ).padStart(2, "0")}`}
                      </Text>
                    </View>
                    <View style={styles.idTimeContainer}>
                      <Text style={styles.OrderText}>{item.orderId}</Text>
                      <Text style={styles.boldText}>{item.timePlaced}</Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.readyPickedHeader}>
                    <Text style={styles.boldText}>{item.orderId}</Text>
                    <Text style={styles.boldText}>{item.timePlaced}</Text>
                  </View>
                )}
              </View>

              {item.items.map((orderItem, index) => (
                <View key={`${item.orderId}-${index}`} style={styles.rowContainer}>
                  <Text style={styles.itemText}>
                    {orderItem.quantity} x {orderItem.name}
                  </Text>
                  <Text style={styles.itemText}>
                    ₹{orderItem.price * orderItem.quantity}
                  </Text>
                </View>
              ))}

              <Text style={styles.totalAmount}>Total: ₹{item.totalAmount}</Text>

              <View style={styles.locationRow}>
                <Icon name="map-marker" size={25} color="red" />
                <Text style={styles.locationText}>{item.location}</Text>
              </View>

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
                ) : item.status === "Delivered" ? (
                  <View style={styles.deliveredBadge}>
                    <Text style={styles.whiteText}>Delivered</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.nextStageButton}
                    onPress={() => handleMoveToNextStatus(item.orderId, item.status)}
                  >
                    <Text style={styles.whiteText}>
                      {item.status === "Preparing"
                        ? "Mark Ready"
                        : item.status === "Ready"
                        ? "Mark Picked Up"
                        : item.status === "Picked Up"
                        ? "Mark Delivery"
                        : null}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noOrdersText}>
            No Orders in {selectedStatus}
          </Text>
        }
      />

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
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeStatus: {
    backgroundColor: "#3B271C",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3B271C",
  },
  whiteText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  Text: {
    color: "#3B271C",
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
  idTimeContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    flex: 1,
  },
  OrderText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  itemText: {
    fontSize: 16,
  },
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
  locationText: {
    marginLeft: 5,
    fontSize: 16,
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
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  nextStageButton: {
    backgroundColor: "#E8BA58",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    color: "black"
  },
  newOrderButton: {
    backgroundColor: "green",
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
  },
  timeButton: {
    borderWidth: 2,
    borderColor: "#3B271C",
    borderStyle: "solid",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  timeText: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#3B271C",
    color: "white",
    paddingHorizontal: 90,
    paddingVertical: 15,
    borderRadius: 5,
  },
  timerBadge: {
    backgroundColor: "orange",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  timerBadgeText: {
    color: "white",
    fontWeight: "bold",
  },
  readyPickedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  deliveredBadge: {
    backgroundColor: "green",
    position: "absolute",
    bottom: -10,
    left: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    zIndex: 1,
  },
});

export default Home;
