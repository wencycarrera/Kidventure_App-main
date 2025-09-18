import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function BadgeCard({ badge }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{badge.name}</Text>
      <Text style={styles.description}>{badge.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, backgroundColor: "#ffeb3b", borderRadius: 10, marginBottom: 10 },
  title: { fontSize: 16, fontWeight: "bold" },
  description: { fontSize: 14 },
});
