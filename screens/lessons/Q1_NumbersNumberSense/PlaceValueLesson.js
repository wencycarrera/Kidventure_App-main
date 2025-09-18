import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PlaceValueLesson({ navigation }) {
  const scaleAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Icon with animation */}
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Ionicons name="md-numbers" size={60} color="#4caf50" />
      </Animated.View>

      <Text style={styles.title}>Place Value & Renaming Numbers</Text>
      <Text style={styles.desc}>
        Visualize tens and ones, and identify the value of each digit in a fun and interactive way.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("PlaceValueExercise")}
      >
        <Text style={styles.buttonText}>Start Exercise</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFDE7",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4caf50",
    marginBottom: 15,
    textAlign: "center",
  },
  desc: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 15,
    width: "60%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
