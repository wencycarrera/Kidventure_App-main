// frontend/screens/teacher/TeacherDashboard.js
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Dimensions } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../backend/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const buttonSize = Math.min(windowWidth / 2 - 30, 150); // responsive square buttons

export default function TeacherDashboard({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace("TeacherLogin");
  };

  const menuItems = [
    { name: "Activities", action: () => navigation.navigate("TeacherActivities"), color: "#9C27B0", icon: "list-outline" },
    { name: "Progress / Scores", action: () => navigation.navigate("TeacherStudentProgress"), color: "#FF9800", icon: "stats-chart-outline" },
    { name: "Materials", action: () => navigation.navigate("TeacherMaterials"), color: "#03A9F4", icon: "document-text-outline" },
  ];

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.gridButton, { backgroundColor: item.color }]}
      onPress={item.action}
    >
      <Ionicons name={item.icon} size={36} color="#FFF" />
      <Text style={styles.gridText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFDE7" }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Teacher Dashboard</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={32} color="#FF7043" />
        </TouchableOpacity>
      </View>

      {/* Grid Menu */}
      <FlatList
        data={menuItems}
        numColumns={2}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.grid}
        renderItem={renderMenuItem}
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
              navigation.navigate("TeacherProfile");
              setMenuVisible(false);
            }}
          >
            <Ionicons name="person-outline" size={20} color="#FF7043" />
            <Text style={styles.menuText}> Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate("TeacherSettings");
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
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#FF7043" },
  grid: { paddingHorizontal: 10, justifyContent: "center", alignItems: "center" },
  gridButton: { width: buttonSize, height: buttonSize, margin: 10, borderRadius: 15, justifyContent: "center", alignItems: "center" },
  gridText: { color: "#FFF", fontSize: 16, fontWeight: "bold", marginTop: 10, textAlign: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  menuContainer: { position: "absolute", right: 0, top: 0, width: 220, height: "100%", backgroundColor: "#FFF", padding: 20, elevation: 10, shadowColor: "#000", shadowOffset: { width: -2, height: 0 }, shadowOpacity: 0.3, shadowRadius: 4, justifyContent: "flex-start" },
  menuTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, color: "#FF7043" },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  menuText: { fontSize: 18, marginLeft: 8, color: "#000" },
});
