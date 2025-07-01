import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PieChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.29.186:2000/api/order"; 

const Insights = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Unauthorized", "No token found. Please login.");
        return;
      }

      const formattedDate = formatDate(selectedDate);
      const response = await fetch(`${BASE_URL}/insights?date=${formattedDate}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("INSIGHTS RESPONSE =>", data);

      if (response.ok) {
        setInsights(data);
      } else {
        setInsights(null);
        Alert.alert("Error", data.message || "Failed to load insights");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Something went wrong while fetching data");
      setInsights(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [selectedDate]);

  const getChartData = () => {
    if (!insights) return [];
    return [
      {
        name: "Placed",
        population: insights.placed,
        color: "#3498db",
        legendFontColor: "#333",
        legendFontSize: 14,
      },
      {
        name: "Delivered",
        population: insights.delivered,
        color: "#2ecc71",
        legendFontColor: "#333",
        legendFontSize: 14,
      },
      {
        name: "Cancelled",
        population: insights.cancelled,
        color: "#e74c3c",
        legendFontColor: "#333",
        legendFontSize: 14,
      },
      {
        name: "Pending",
        population: insights.pending,
        color: "#f39c12",
        legendFontColor: "#333",
        legendFontSize: 14,
      },
    ];
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 📅 Date Picker */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.dateText}>📅 {formatDate(selectedDate)}</Text>
      </TouchableOpacity>

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

      {/* ⏳ Loading */}
      {loading ? (
        <ActivityIndicator size="large" color="#603F26" style={{ marginTop: 50 }} />
      ) : insights ? (
        <>
          {/* 🟦 Order Count Cards */}
          <View style={styles.cardContainer}>
            <View style={[styles.card, { backgroundColor: "#3498db" }]}>
              <Text style={styles.cardTitle}>Placed</Text>
              <Text style={styles.cardValue}>{insights.placed}</Text>
            </View>
            <View style={[styles.card, { backgroundColor: "#2ecc71" }]}>
              <Text style={styles.cardTitle}>Delivered</Text>
              <Text style={styles.cardValue}>{insights.delivered}</Text>
            </View>
            <View style={[styles.card, { backgroundColor: "#e74c3c" }]}>
              <Text style={styles.cardTitle}>Cancelled</Text>
              <Text style={styles.cardValue}>{insights.cancelled}</Text>
            </View>
            <View style={[styles.card, { backgroundColor: "#f39c12" }]}>
              <Text style={styles.cardTitle}>Pending</Text>
              <Text style={styles.cardValue}>{insights.pending}</Text>
            </View>
          </View>

          {/* 📊 Pie Chart */}
          <View style={styles.chartContainer}>
            <PieChart
              data={getChartData()}
              width={Dimensions.get("window").width}
              height={250}
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: (opacity = 1) => `rgba(52, 73, 94, ${opacity})`,
                labelColor: () => "#2c3e50",
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="0"
              center={[100, 0]}
              hasLegend={false}
              absolute
            />
          </View>
        </>
      ) : (
        <Text style={{ marginTop: 20, fontSize: 16 }}>No data found for this date</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  dateButton: {
    backgroundColor: "#603F26",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cardContainer: {
    width: "100%",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  cardValue: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 300,
    marginTop: -30,
  },
});

export default Insights;
