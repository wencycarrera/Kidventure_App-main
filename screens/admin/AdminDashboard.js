import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../backend/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

export default function AdminDashboard({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    lessons: 0,
    activities: 0,
    progress: 0,
    rewards: 0,
  });

  const [studentRoles, setStudentRoles] = useState([]);
  const [teacherRoles, setTeacherRoles] = useState([]);

  // Load counts and roles from Firestore
  useEffect(() => {
    let loadedCollections = 0;
    const collections = [
      { name: "students", key: "students" },
      { name: "teachers", key: "teachers" },
      { name: "lessons", key: "lessons" },
      { name: "teacherActivities", key: "activities" },
      { name: "progress", key: "progress" },
      { name: "rewards", key: "rewards" },
    ];

    const unsubscribes = collections.map(col =>
      onSnapshot(collection(db, col.name), snap => {
        setCounts(prev => ({ ...prev, [col.key]: snap.size }));
        loadedCollections++;

        if (col.name === "students") {
          const roles = snap.docs.map(doc => ({
            username: doc.data().username,
            role: doc.data().role,
          }));
          setStudentRoles(roles);
        }

        if (col.name === "teachers") {
          const roles = snap.docs.map(doc => ({
            username: doc.data().username,
            role: doc.data().role,
          }));
          setTeacherRoles(roles);
        }

        if (loadedCollections === collections.length) setLoading(false);
      })
    );

    return () => unsubscribes.forEach(unsub => unsub());
  }, []);

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7043" />
      </View>
    );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={24} color="#FFF" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Admin Dashboard</Text>

        {[
          { label: "Students", count: counts.students, screen: "ManageStudents"},
          { label: "Teachers", count: counts.teachers, screen: "ManageTeachers"},
          { label: "Lessons", count: counts.lessons, screen: "ManageLessons" },
          { label: "Activities", count: counts.activities, screen: "ManageActivities" },
          { label: "Progress Entries", count: counts.progress, screen: "ManageProgress" },
          { label: "Rewards", count: counts.rewards, screen: "ManageRewards" },
        ].map((item, index) => (
          <View key={index} style={{ width: "100%" }}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Text style={styles.cardTitle}>{item.label}</Text>
              <Text style={styles.cardCount}>{item.count}</Text>
            </TouchableOpacity>

            {/* Display roles for Students and Teachers */}
            {item.roles &&
              item.roles.map((user, i) => (
                <Text key={i} style={styles.roleText}>
                  {user.username} ({user.role})
                </Text>
              ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFDE7" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContainer: { paddingTop: 120, paddingHorizontal: 20, alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#FF7043", marginBottom: 30 },
  card: {
    width: "100%",
    padding: 20,
    backgroundColor: "#FFCA28",
    borderRadius: 15,
    marginBottom: 5,
    alignItems: "center",
    elevation: 2,
  },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  cardCount: { fontSize: 26, fontWeight: "bold", color: "#FFF", marginTop: 5 },
  roleText: { fontSize: 14, color: "#333", marginLeft: 15, marginBottom: 5 },
  backButton: {
    position: "absolute",
    top: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF7043",
    padding: 10,
    borderRadius: 10,
    zIndex: 10,
  },
  backText: { color: "#FFF", fontWeight: "bold", marginLeft: 5 },
});
