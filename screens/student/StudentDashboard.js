// frontend/screens/student/StudentDashboard.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Dimensions, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { auth, db } from "../../backend/firebaseConfig";

const windowWidth = Dimensions.get("window").width;
const buttonSize = Math.min(windowWidth / 2 - 30, 150); // responsive square buttons

export default function StudentDashboard({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);

  const studentId = auth.currentUser?.uid;

  const menuItems = [
    { name: "Lessons", screen: "LessonsQ1", color: "#4caf50", icon: "book-outline" },
    { name: "Exercises", screen: "ExerciseQ1", color: "#2196f3", icon: "create-outline" },
    { name: "Progress", screen: "ProgressScreen", color: "#FF9800", icon: "stats-chart-outline" },
    { name: "Activities", screen: "StudentActivitiesScreen", color: "#9C27B0", icon: "list-outline" },
  ];

  // Fetch active activities and progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const activitiesQuery = query(collection(db, "teacherActivities"), where("active", "==", true));
        const activitiesSnapshot = await getDocs(activitiesQuery);
        const activitiesData = activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const progressObj = {};
        for (let i = 0; i < activitiesData.length; i++) {
          const activity = activitiesData[i];
          const progressRef = doc(db, "studentProgress", `${studentId}_${activity.id}`);
          const progressSnap = await getDoc(progressRef);
          progressObj[activity.id] = progressSnap.exists()
            ? progressSnap.data()
            : { completed: false, score: null };
        }

        const completedCount = Object.values(progressObj).filter(p => p.completed).length;
        const totalCount = activitiesData.length;

        setProgressData({
          lessons: activitiesData.filter(a => a.type === "Lesson").length > 0
            ? `${Object.values(progressObj).filter((p, i) => activitiesData[i].type === "Lesson" && p.completed).length}/${activitiesData.filter(a => a.type === "Lesson").length}`
            : "0/0",
          exercises: activitiesData.filter(a => a.type === "Exercise").length > 0
            ? `${Object.values(progressObj).filter((p, i) => activitiesData[i].type === "Exercise" && p.completed).length}/${activitiesData.filter(a => a.type === "Exercise").length}`
            : "0/0",
          progress: `${completedCount}/${totalCount}`,
          activities: totalCount > 0 ? `${completedCount}/${totalCount}` : "0/0",
        });
      } catch (error) {
        console.log("Error fetching activities progress:", error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchProgress();
  }, [studentId]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace("AuthMenu");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#FF7043" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFDE7" }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Student Dashboard</Text>
        <TouchableOpacity style={styles.hamburger} onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="#FF7043" />
        </TouchableOpacity>
      </View>

      {/* Grid Buttons */}
      <FlatList
        data={menuItems}
        numColumns={2} // always 2 columns
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.grid}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.gridButton, { backgroundColor: item.color }]}
            onPress={() => navigation.navigate(item.screen, { studentId })}
          >
            <Ionicons name={item.icon} size={36} color="#FFF" />
            <Text style={styles.gridText}>{item.name}</Text>
            {progressData[item.name.toLowerCase()] && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{progressData[item.name.toLowerCase()]}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      {/* Hamburger Menu Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)} />
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Menu</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate("StudentProfile");
              setMenuVisible(false);
            }}
          >
            <Ionicons name="person-outline" size={20} color="#FF7043" />
            <Text style={styles.menuText}> Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate("StudentSettings");
              setMenuVisible(false);
            }}
          >
            <Ionicons name="settings-outline" size={20} color="#FF7043" />
            <Text style={styles.menuText}> Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="red" />
            <Text style={[styles.menuText, { color: "red" }]}> Logout</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#FF7043" },
  hamburger: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  grid: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  gridButton: {
    width: buttonSize,
    height: buttonSize,
    margin: 10,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  gridText: { color: "#FFF", fontSize: 18, fontWeight: "bold", marginTop: 10, textAlign: "center" },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 12, fontWeight: "bold", color: "#000" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  menuContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 220,
    height: "100%",
    backgroundColor: "#FFF",
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    justifyContent: "flex-start",
  },
  menuTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, color: "#FF7043" },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  menuText: { fontSize: 18, marginLeft: 8, color: "#000" },
});
