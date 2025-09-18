import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Leaderboard({ students }) {
  const sorted = [...students].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      {sorted.map((s, index) => (
        <View key={s.id} style={styles.row}>
          <Text>{index + 1}. {s.name}</Text>
          <Text>{s.totalPoints} pts</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
});
