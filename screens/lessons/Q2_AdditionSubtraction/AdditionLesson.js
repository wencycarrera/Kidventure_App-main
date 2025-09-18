import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AdditionLesson({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Fun vector icon at top */}
      <MaterialCommunityIcons 
        name="plus-circle-outline" 
        size={100} 
        color="#FF7043" 
        style={{ marginBottom: 20 }} 
      />

      <Text style={styles.title}>Addition (1–3 numbers)</Text>
      <Text style={styles.description}>
        Let's have fun adding numbers! Practice single and multi-digit addition with or without regrouping.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Exercises", { exercise: "AdditionExercise" })}
      >
        <MaterialCommunityIcons name="play-circle" size={24} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.buttonText}>Start Exercise</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#FFFDE7" 
  },
  title: { 
    fontSize: 26, 
    fontWeight: "bold", 
    marginBottom: 15, 
    color: "#FF7043", 
    textAlign: "center" 
  },
  description: { 
    fontSize: 16, 
    marginBottom: 30, 
    textAlign: "center", 
    color: "#555" 
  },
  button: { 
    flexDirection: "row",
    backgroundColor: "#4caf50", 
    padding: 15, 
    borderRadius: 20, 
    width: "70%", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 18 
  },
});
