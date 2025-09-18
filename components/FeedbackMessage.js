import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function FeedbackMessage({ isCorrect }) {
  return (
    <View style={[styles.container, { backgroundColor: isCorrect ? "#4caf50" : "#f44336" }]}>
      <Text style={styles.text}>{isCorrect ? "Correct!" : "Try Again!"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, borderRadius: 8, marginTop: 15, alignItems: "center" },
  text: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
