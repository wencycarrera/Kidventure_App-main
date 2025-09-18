// frontend/screens/admin/ManageStudents.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../../backend/firebaseConfig";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";

export default function ManageStudents({ navigation }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "students"), snap => {
      setStudents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = (id) => {
    Alert.alert("Delete Student", "Are you sure you want to delete this student?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try {
          await deleteDoc(doc(db, "students", id));
          Alert.alert("Deleted", "Student record deleted successfully");
        } catch (error) {
          Alert.alert("Error", "Failed to delete student: " + error.message);
        }
      }}
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.fullName}</Text>
      <View style={styles.actions}>
        {/* Navigate to StudentDetail */}
        <TouchableOpacity onPress={() => navigation.navigate("StudentDetail", { studentId: item.id })}>
          <Ionicons name="eye-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>
        {/* Delete student */}
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#F44336" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#FF7043" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FFF" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <FlatList
        data={students}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFFDE7" },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF7043",
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  backText: { color: "#FFF", fontWeight: "bold", marginLeft: 5 },
  item: { flexDirection: "row", justifyContent: "space-between", padding: 15, backgroundColor: "#FFCA28", marginBottom: 10, borderRadius: 10 },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  actions: { flexDirection: "row", alignItems: "center" },
});
