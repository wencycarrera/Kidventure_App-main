import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { db } from "../../../backend/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function ManageProgress({ navigation }) {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "progress"), snap => {
      setProgress(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>Student ID: {item.student_id}</Text>
      <Text>Lesson ID: {item.lesson_id}</Text>
      <Text>Score: {item.score}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#FF7043" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FFF" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <FlatList
        data={progress}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFFDE7" },
  backButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#FF7043", padding: 10, borderRadius: 10, alignSelf: "flex-start", marginBottom: 10 },
  backText: { color: "#FFF", fontWeight: "bold", marginLeft: 5 },
  item: { padding: 15, backgroundColor: "#FFCA28", marginBottom: 10, borderRadius: 10 },
});
