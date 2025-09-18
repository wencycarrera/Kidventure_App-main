import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProgressDashboard({ student }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{student.fullName}</Text>
      <Text style={styles.info}>Age: {student.age}</Text>
      <Text style={styles.info}>Gender: {student.gender}</Text>
      <Text style={styles.info}>Birthday: {student.birthday}</Text>
      <Text style={styles.info}>Parent: {student.parentName}</Text>
      <Text style={styles.info}>Email: {student.email}</Text>
      <Text style={styles.info}>Phone: {student.phoneNumber}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    marginVertical: 8,
    borderRadius: 15,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF7043",
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
});
