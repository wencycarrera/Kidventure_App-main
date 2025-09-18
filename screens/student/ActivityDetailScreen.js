import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../backend/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

export default function ActivityDetailScreen({ route, navigation }) {
  const { activityId, studentId } = route.params;
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const activityRef = doc(db, "teacherActivities", activityId);
        const activitySnap = await getDoc(activityRef);

        if (activitySnap.exists()) {
          setActivity(activitySnap.data());
        } else {
          Alert.alert("Error", "Activity not found!");
        }

        const progressRef = doc(db, "studentProgress", `${studentId}_${activityId}`);
        const progressSnap = await getDoc(progressRef);
        if (progressSnap.exists()) setCompleted(progressSnap.data().completed);
      } catch (error) {
        console.log("Error fetching activity:", error);
        Alert.alert("Error", "Failed to load activity.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [activityId, studentId]);

  const markCompleted = async () => {
    if (!activity || !activity.active) return;

    try {
      await setDoc(doc(db, "studentProgress", `${studentId}_${activityId}`), {
        studentId,
        activityId,
        type: "activity",
        completed: true,
        score: "✅",
      });
      setCompleted(true);
      Alert.alert("Success", "Activity marked as completed!");
    } catch (error) {
      console.log("Error updating progress:", error);
      Alert.alert("Error", "Could not update progress.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9C27B0" />
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Activity not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#9C27B0" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{activity.title}</Text>
      <Text style={styles.description}>{activity.description || "No description provided."}</Text>

      {!activity.active && (
        <Text style={styles.inactiveText}>This activity is currently inactive and locked.</Text>
      )}

      <TouchableOpacity
        style={[
          styles.button, 
          completed && { backgroundColor: "#4caf50" },
          !activity.active && { backgroundColor: "#BDBDBD" }
        ]}
        onPress={markCompleted}
        disabled={completed || !activity.active}
      >
        <Text style={styles.buttonText}>
          {!activity.active ? "Locked 🔒" : completed ? "Completed ✅" : "Mark as Complete"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFFDE7" },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backText: { marginLeft: 5, color: "#9C27B0", fontSize: 16, fontWeight: "bold" },
  title: { fontSize: 22, fontWeight: "bold", color: "#9C27B0", marginBottom: 15 },
  description: { fontSize: 16, marginBottom: 20, color: "#4A148C" },
  button: { backgroundColor: "#9C27B0", padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  emptyText: { fontSize: 18, color: "#9C27B0", textAlign: "center", marginTop: 50 },
  inactiveText: { fontSize: 16, color: "#E53935", marginBottom: 15, textAlign: "center" },
});
