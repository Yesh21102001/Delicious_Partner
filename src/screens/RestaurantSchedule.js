import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const RestaurantSchedule = () => {
  const [morningTime, setMorningTime] = useState(new Date(2023, 1, 1, 8, 0));
  const [eveningTime, setEveningTime] = useState(new Date(2023, 1, 1, 18, 0));
  const [status, setStatus] = useState("Closed");
  const [showMorningPicker, setShowMorningPicker] = useState(false);
  const [showEveningPicker, setShowEveningPicker] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (!isEnabled) {
      setStatus("Closed");
      return;
    }
    const checkTime = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const morningMinutes = morningTime.getHours() * 60 + morningTime.getMinutes();
      const eveningMinutes = eveningTime.getHours() * 60 + eveningTime.getMinutes();

      if (currentTime === morningMinutes || currentTime === eveningMinutes) {
        setStatus("Open");
      }
    };
    
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [morningTime, eveningTime, isEnabled]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant Schedule</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Enable Schedule</Text>
        <Switch value={isEnabled} onValueChange={setIsEnabled} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Morning Open Time</Text>
        <TouchableOpacity style={styles.button} onPress={() => setShowMorningPicker(true)} disabled={!isEnabled}>
          <Text style={styles.buttonText}>{morningTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showMorningPicker && (
          <DateTimePicker
            value={morningTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowMorningPicker(false);
              if (selectedTime) setMorningTime(selectedTime);
            }}
          />
        )}
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Evening Open Time</Text>
        <TouchableOpacity style={styles.button} onPress={() => setShowEveningPicker(true)} disabled={!isEnabled}>
          <Text style={styles.buttonText}>{eveningTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showEveningPicker && (
          <DateTimePicker
            value={eveningTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowEveningPicker(false);
              if (selectedTime) setEveningTime(selectedTime);
            }}
          />
        )}
      </View>
      <Text style={styles.status}>Status: {status}</Text>
      <TouchableOpacity style={styles.button} onPress={() => alert("Schedule Saved!")} disabled={!isEnabled}>
        <Text style={styles.buttonText}>Save Schedule</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 10,
  },
  status: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    marginTop: 12,
  },
  button: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
    width: "90%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RestaurantSchedule;