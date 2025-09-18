import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'; // vector icons library

export default function OrderingComparingLesson({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconWrapper}>
        <MaterialIcons name="sort" size={80} color="#fff" />
      </View>

      {/* Lesson Title */}
      <Text style={styles.title}>Ordering & Comparing Numbers</Text>

      {/* Lesson Description */}
      <Text style={styles.description}>
        In this lesson, you'll learn how to order numbers from smallest to largest 
        and compare numbers using “greater than”, “less than”, and “equal to”. 
        Interactive exercises will help you practice step by step. 
        Get ready to become a number master! 🧮
      </Text>

      {/* Start Exercise Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Exercises", { exercise: "OrderingExercise" })}
      >
        <Text style={styles.buttonText}>Start Exercise</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 30, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#FFFDE7" 
  },
  iconWrapper: {
    backgroundColor: "#4CAF50", 
    padding: 30, 
    borderRadius: 100, 
    marginBottom: 30, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  title: { 
    fontSize: 26, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center", 
    color: "#4CAF50" 
  },
  description: { 
    fontSize: 18, 
    marginBottom: 40, 
    textAlign: "center", 
    lineHeight: 28,
    color: "#333"
  },
  button: { 
    backgroundColor: "#4CAF50", 
    paddingVertical: 20, 
    paddingHorizontal: 40, 
    borderRadius: 15, 
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 20 
  },
});
