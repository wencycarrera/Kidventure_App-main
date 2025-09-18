import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../../backend/firebaseConfig";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";

export default function ManageLessons({ navigation }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "lessons"), snap => {
      setLessons(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    Alert.alert("Delete Lesson", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await deleteDoc(doc(db, "lessons", id)); } }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.title}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => navigation.navigate("EditLesson", { lessonId: item.id })}>
          <Ionicons name="pencil-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#F44336" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
      </View>
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
        data={lessons}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFFDE7" },
  backButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#FF7043", padding: 10, borderRadius: 10, alignSelf: "flex-start" },
  backText: { color: "#FFF", fontWeight: "bold", marginLeft: 5 },
  item: { flexDirection: "row", justifyContent: "space-between", padding: 15, backgroundColor: "#FFCA28", marginBottom: 10, borderRadius: 10 },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  actions: { flexDirection: "row", alignItems: "center" },
});
