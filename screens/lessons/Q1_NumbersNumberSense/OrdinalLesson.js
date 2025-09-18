import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'; // white icon

export default function OrdinalLesson({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconWrapper}>
        <MaterialIcons name="looks-one" size={80} color="#fff" />
      </View>

      {/* Lesson Title */}
      <Text style={styles.title}>Ordinal Numbers (1st–10th)</Text>

      {/* Lesson Description */}
      <Text style={styles.description}>
        Join Coco 🐱 on an exciting adventure! Learn how to identify positions in a line 
        or a group like 1st, 2nd, 3rd… up to 10th. 
        Tap the objects in order as you follow the story and discover the magic of ordinal numbers. 
        This interactive story will make learning fun and easy to remember!
      </Text>

      {/* Start Exercise Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Exercises", { exercise: "OrdinalExercise" })}
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
