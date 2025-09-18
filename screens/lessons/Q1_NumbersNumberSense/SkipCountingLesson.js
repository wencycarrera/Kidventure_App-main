import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

export default function SkipCountingLesson({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconWrapper}>
        <MaterialIcons name="plus-one" size={80} color="#fff" />
      </View>

      {/* Title */}
      <Text style={styles.title}>Skip Counting (2s, 5s, 10s)</Text>

      {/* Description */}
      <Text style={styles.desc}>
        Join Coco 🐱 on a fun adventure to practice skip counting! 
        Learn how to count by 2s, 5s, and 10s while exploring colorful objects. 
        Tap the items as they appear and hear the numbers spoken aloud. 
        This interactive story helps you recognize patterns in numbers 
        and makes learning skip counting exciting and memorable.
      </Text>

      {/* Start Exercise Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SkipCountingExercise")}
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
    padding: 30, 
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
  desc: { 
    fontSize: 18, 
    textAlign: "center", 
    lineHeight: 28, 
    marginBottom: 40, 
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
