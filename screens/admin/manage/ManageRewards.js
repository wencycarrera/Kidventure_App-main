import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { db } from "../../../backend/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function ManageRewards({ navigation }) {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "rewards"), snap => {
      setRewards(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>Student ID: {item.student_id}</Text>
      <Text>Reward: {item.reward_type}</Text>
      <Text>Date: {item.date_awarded}</Text>
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
        data={rewards}
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
