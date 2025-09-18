import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Platform } from "react-native";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../backend/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

export default function TeacherStudentProgress({ navigation }) {
  const [progressData, setProgressData] = useState([]);
  const [students, setStudents] = useState({});
  const [loading, setLoading] = useState(true);

  // Cross-platform alert
  const showAlert = (title, message) => {
    if (Platform.OS === "web" && window.alert) {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all active students
        const studentsRef = collection(db, "students");
        const studentSnap = await getDocs(studentsRef);
        const studentMap = {};
        studentSnap.docs.forEach(snap => {
          studentMap[snap.id] = snap.data().fullName || "Unknown Student";
        });
        setStudents(studentMap);

        // Fetch all studentProgress
        const progressRef = collection(db, "studentProgress");
        const progressSnap = await getDocs(progressRef);
        const progressArr = progressSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          // Only include records whose studentId exists in active students
          .filter(item => studentMap[item.studentId]);

        // Group by studentId
        const grouped = {};
        progressArr.forEach(item => {
          if (!grouped[item.studentId]) grouped[item.studentId] = [];
          grouped[item.studentId].push(item);
        });
        setProgressData(Object.entries(grouped)); // [[studentId, [activities]], ...]
      } catch (error) {
        console.log("Error fetching data:", error);
        showAlert("Error", "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const confirmDelete = (studentId, activityId) => {
    if (Platform.OS === "web" && window.confirm) {
      if (window.confirm("Are you sure you want to delete this activity record?")) {
        deleteActivity(studentId, activityId);
      }
    } else {
      Alert.alert(
        "Delete Record",
        "Are you sure you want to delete this activity record?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: () => deleteActivity(studentId, activityId) }
        ]
      );
    }
  };

  const deleteActivity = async (studentId, activityId) => {
    try {
      await deleteDoc(doc(db, "studentProgress", activityId));
      // Remove from local state
      setProgressData(prev =>
        prev.map(([sId, activities]) =>
          sId === studentId
            ? [sId, activities.filter(a => a.id !== activityId)]
            : [sId, activities]
        )
      );
      showAlert("Deleted", "Activity record deleted successfully.");
    } catch (error) {
      console.log("Error deleting activity:", error);
      showAlert("Error", "Could not delete this record.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFDE7" }}>
      {/* Fixed Back Button */}
      <TouchableOpacity style={styles.fixedBackButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={24} color="#FFF" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7043" />
        </View>
      ) : progressData.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.noDataText}>No students are currently doing activities.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Students Activity Progress</Text>
          {progressData.map(([studentId, activities], idx) => (
            <View key={idx} style={styles.studentBlock}>
              {/* Display student name */}
              <Text style={styles.studentTitle}>
                {students[studentId] ? students[studentId] : ""}
              </Text>
              {activities.map((item, aIdx) => (
                <View key={aIdx} style={styles.progressItem}>
                  <Text style={styles.lessonName}>{item.lessonName}</Text>
                  <Text>Completed: {item.completed ? "Yes ✅" : "No ❌"}</Text>
                  <Text>Score: {item.score ?? "N/A"}</Text>
                  <Text>Date: {item.date ?? "N/A"}</Text>
                  <Text>Viewed At: {item.viewedAt ? new Date(item.viewedAt).toLocaleString() : "N/A"}</Text>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => confirmDelete(studentId, item.id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFDE7" },
  container: { padding: 20, paddingTop: 100 },
  fixedBackButton: {
    position: "absolute",
    top: 50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF7043",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 10,
  },
  backButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16, marginLeft: 5 },
  title: { fontSize: 22, fontWeight: "bold", color: "#FF7043", marginBottom: 20, textAlign: "center" },
  studentBlock: { marginBottom: 25, padding: 10, backgroundColor: "#FFD54F", borderRadius: 12 },
  studentTitle: { fontSize: 18, fontWeight: "bold", color: "#FFF", marginBottom: 10 },
  progressItem: { backgroundColor: "#FFA726", padding: 10, borderRadius: 8, marginBottom: 8 },
  lessonName: { fontSize: 16, fontWeight: "bold", color: "#FFF" },
  deleteButton: { marginTop: 8, backgroundColor: "#E53935", paddingVertical: 5, borderRadius: 6, alignItems: "center" },
  deleteButtonText: { color: "#FFF", fontWeight: "bold" },
  noDataText: { fontSize: 16, color: "#333", marginTop: 20 },
});
