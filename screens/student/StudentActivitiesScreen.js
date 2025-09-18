import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db, auth } from "../../backend/firebaseConfig";
import { collection, getDocs, setDoc, doc, query, where } from "firebase/firestore";

export default function StudentActivitiesScreen({ navigation }) {
  const [activities, setActivities] = useState([]);
  const [progress, setProgress] = useState([]);
  const activitiesRef = collection(db, "teacherActivities");

  const studentId = auth.currentUser ? auth.currentUser.uid : "unknown";

  // Cross-platform alert
  const showAlert = (title, message) => {
    if (Platform.OS === "web" && window.alert) {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // Fetch all activities
  const fetchActivities = async () => {
    try {
      const snapshot = await getDocs(activitiesRef);
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => new Date(a.activityDate) - new Date(b.activityDate));
      setActivities(data);
    } catch (error) {
      console.log("Error fetching activities:", error);
      showAlert("Error", "Failed to load activities");
    }
  };

  // Fetch student progress
  const fetchProgress = async () => {
    try {
      const progressRef = collection(db, "studentProgress");
      const q = query(progressRef, where("studentId", "==", studentId));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setProgress(data);
    } catch (error) {
      console.log("Error fetching progress:", error);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchProgress();
  }, []);

  const openActivity = async (item) => {
    const today = new Date();
    const activityDate = new Date(item.activityDate);

    if (!item.active || activityDate < today) {
      return showAlert("Activity Locked", "This activity cannot be opened yet.");
    }

    try {
      // Record the activity view
      await setDoc(
        doc(db, "studentProgress", `${studentId}_${item.id}`),
        {
          studentId,
          activityId: item.id,
          lessonName: item.title,
          type: item.type,
          completed: false,
          score: null,
          date: new Date().toISOString(),
          viewedAt: new Date(),
        },
        { merge: true }
      );

      showAlert("Activity Started", `Activity "${item.title}" has begun!`);

      // Navigate to detail screen
      navigation.navigate("ActivityDetailScreen", { activityId: item.id, studentId });
    } catch (error) {
      console.log("Error recording activity view:", error);
      showAlert("Activity Error", "Could not open this activity.");
    }
  };

  const renderActivity = ({ item }) => {
    const today = new Date();
    const isLocked = !item.active || new Date(item.activityDate) < today;

    // Check if completed
    const completed = progress.some(p => p.activityId === item.id && p.completed);

    return (
      <TouchableOpacity
        style={[styles.activityCard, isLocked && styles.lockedCard]}
        onPress={() => openActivity(item)}
      >
        <Ionicons
          name="document-text-outline"
          size={24}
          color={isLocked ? "#BDBDBD" : "#FFF"}
          style={{ marginRight: 10 }}
        />
        <Text style={[styles.activityText, isLocked && { color: "#BDBDBD" }]}>
          {item.title} ({item.type}) - {item.activityDate} {isLocked ? "🔒" : ""}
          {completed && !isLocked ? " ✅" : ""}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#FF7043" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Student Activities</Text>

      {activities.length > 0 ? (
        <FlatList
          data={activities}
          keyExtractor={item => item.id}
          renderItem={renderActivity}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={{ color: "#888", marginTop: 20, textAlign: "center" }}>
          No activities available.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFFDE7" },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backText: { marginLeft: 5, color: "#FF7043", fontSize: 16, fontWeight: "bold" },
  title: { fontSize: 26, fontWeight: "bold", color: "#FF7043", marginBottom: 20, textAlign: "center" },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#9C27B0",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  lockedCard: {
    backgroundColor: "#E0E0E0",
  },
  activityText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
