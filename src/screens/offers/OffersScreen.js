import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";

const API_BASE_URL = "http://192.168.29.186:2000/api/coupon";

const OffersScreen = () => {
  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState({
    code: "",
    description: "",
    discountAmount: "",
    minOrderAmount: "",
    expiryDate: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingOffer, setEditingOffer] = useState({});
  const [editingDatePicker, setEditingDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE_URL + "/");
      setOffers(res.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load offers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addOffer = async () => {
    const { code, description, discountAmount, minOrderAmount, expiryDate } =
      newOffer;
    if (
      !code ||
      !description ||
      !discountAmount ||
      !minOrderAmount ||
      !expiryDate
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post(API_BASE_URL + "/create", {
        code,
        description,
        discountAmount: Number(discountAmount),
        minOrderAmount: Number(minOrderAmount),
        expiryDate,
      });

      setNewOffer({
        code: "",
        description: "",
        discountAmount: "",
        minOrderAmount: "",
        expiryDate: "",
      });

      await fetchCoupons(); // Fetch fresh list
    } catch (error) {
      Alert.alert("Error", "Failed to add offer");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteOffer = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/${id}`);
      setOffers((prev) => prev.filter((offer) => offer._id !== id));
      if (editingId === id) cancelEdit();
    } catch (error) {
      Alert.alert("Error", "Failed to delete offer");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (offer) => {
    setEditingId(offer._id);
    setEditingOffer({ ...offer });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingOffer({});
  };

  const saveEdit = async () => {
    const { code, description, discountAmount, minOrderAmount, expiryDate } =
      editingOffer;
    if (
      !code ||
      !description ||
      !discountAmount ||
      !minOrderAmount ||
      !expiryDate
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(`${API_BASE_URL}/${editingId}`, {
        code,
        description,
        discountAmount: Number(discountAmount),
        minOrderAmount: Number(minOrderAmount),
        expiryDate,
      });

      setOffers((prev) =>
        prev.map((offer) => (offer._id === editingId ? res.data : offer))
      );
      cancelEdit();
    } catch (error) {
      Alert.alert("Error", "Failed to update offer");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setNewOffer((prev) => ({ ...prev, expiryDate: formattedDate }));
    }
  };

  const handleEditDateChange = (event, selectedDate) => {
    setEditingDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setEditingOffer((prev) => ({ ...prev, expiryDate: formattedDate }));
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#603F26" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Offers</Text>

      {/* New Offer Form */}
      <TextInput
        placeholder="Coupon Code"
        style={styles.input}
        value={newOffer.code}
        onChangeText={(text) => setNewOffer({ ...newOffer, code: text })}
      />
      <TextInput
        placeholder="Description"
        style={styles.input}
        value={newOffer.description}
        onChangeText={(text) => setNewOffer({ ...newOffer, description: text })}
      />
      <TextInput
        placeholder="Discount Amount"
        keyboardType="numeric"
        style={styles.input}
        value={newOffer.discountAmount}
        onChangeText={(text) =>
          setNewOffer({ ...newOffer, discountAmount: text })
        }
      />
      <TextInput
        placeholder="Min Order Amount"
        keyboardType="numeric"
        style={styles.input}
        value={newOffer.minOrderAmount}
        onChangeText={(text) =>
          setNewOffer({ ...newOffer, minOrderAmount: text })
        }
      />
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {newOffer.expiryDate ? `Expiry: ${newOffer.expiryDate}` : "Select Expiry Date"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={addOffer}>
        <Text style={styles.buttonText}>Add Offer</Text>
      </TouchableOpacity>

      {/* List of Offers */}
      <FlatList
        data={offers}
        keyExtractor={(item, index) => item._id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {editingId === item._id ? (
              <>
                <TextInput
                  style={styles.input}
                  value={editingOffer.code}
                  onChangeText={(text) =>
                    setEditingOffer({ ...editingOffer, code: text })
                  }
                />
                <TextInput
                  style={styles.input}
                  value={editingOffer.description}
                  onChangeText={(text) =>
                    setEditingOffer({ ...editingOffer, description: text })
                  }
                />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={editingOffer.discountAmount.toString()}
                  onChangeText={(text) =>
                    setEditingOffer({ ...editingOffer, discountAmount: text })
                  }
                />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={editingOffer.minOrderAmount.toString()}
                  onChangeText={(text) =>
                    setEditingOffer({ ...editingOffer, minOrderAmount: text })
                  }
                />
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setEditingDatePicker(true)}
                >
                  <Text style={styles.dateText}>
                    {editingOffer.expiryDate
                      ? `Expiry: ${editingOffer.expiryDate}`
                      : "Select Expiry Date"}
                  </Text>
                </TouchableOpacity>
                {editingDatePicker && (
                  <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleEditDateChange}
                  />
                )}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={saveEdit}
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionButtonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={cancelEdit}
                    style={[styles.actionButton, { backgroundColor: "gray" }]}
                  >
                    <Text style={styles.actionButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.code}>{item.code}</Text>
                <Text>{item.description}</Text>
                <Text>Discount: ₹{item.discountAmount}</Text>
                <Text>Min Order: ₹{item.minOrderAmount}</Text>
                <Text>Expires: {item.expiryDate}</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => startEditing(item)}
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteOffer(item._id)}
                    style={[styles.actionButton, { backgroundColor: "red" }]}
                  >
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#603F26",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  card: {
    backgroundColor: "#FFEAC5",
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  code: { fontSize: 16, fontWeight: "bold" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "green",
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  dateButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  dateText: {
    color: "#333",
  },
});

export default OffersScreen;