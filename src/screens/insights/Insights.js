import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const Insights = () => {
  const orderData = [
    { name: 'Orders Placed', population: 120, color: '#3498db', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'Orders Delivered', population: 90, color: '#2ecc71', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'Orders Cancelled', population: 30, color: '#e74c3c', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'Orders Pending', population: 20, color: '#f39c12', legendFontColor: '#333', legendFontSize: 14 },
  ];

  const earningsData = [
    { name: 'Total Revenue', value: '$15,600', color: '#8e44ad' },
    { name: 'Total Profit', value: '$3,800', color: '#27ae60' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Order Summary Cards */}
      <View style={styles.cardContainer}>
        {orderData.map((item, index) => (
          <View key={index} style={[styles.card, { backgroundColor: item.color }]}> 
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardValue}>{item.population}</Text>
          </View>
        ))}
      </View>

      {/* Earnings Summary */}
      <View style={styles.earningsContainer}>
        {earningsData.map((item, index) => (
          <View key={index} style={[styles.earningCard, { backgroundColor: item.color }]}> 
            <Text style={styles.earningTitle}>{item.name}</Text>
            <Text style={styles.earningValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Pie Chart for Orders */}
      <PieChart
        data={orderData}
        width={Dimensions.get('window').width - 40}
        height={250}
        chartConfig={{
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgba(52, 73, 94, ${opacity})`,
          labelColor: () => '#2c3e50',
        }}
        accessor='population'
        backgroundColor='transparent'
        paddingLeft='15'
        center={[0, 0]}
        hasLegend={true}
        absolute
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  card: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  earningsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  earningCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  earningTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  earningValue: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Insights;
