import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { PieChart } from "react-native-chart-kit";

const Insights = () => {
  const orderData = [
    {
      name: "Orders Placed",
      population: 120,
      color: "#3498db",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Orders Delivered",
      population: 90,
      color: "#2ecc71",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Orders Cancelled",
      population: 30,
      color: "#e74c3c",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Orders Pending",
      population: 20,
      color: "#f39c12",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Order Summary Cards */}
      <View style={styles.cardContainer}>
        {orderData.map((item, index) => (
          <View
            key={index}
            style={[styles.card, { backgroundColor: item.color }]}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardValue}>{item.population}</Text>
          </View>
        ))}
      </View>

      {/* Pie Chart for Orders */}
      <View style={styles.chartContainer}>
        <PieChart
          data={orderData}
          width={Dimensions.get("window").width} // full width
          height={250}
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(52, 73, 94, ${opacity})`,
            labelColor: () => "#2c3e50",
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="0" // no extra padding needed
          center={[100, 0]}
          hasLegend={false}
          absolute
        />
      </View>
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