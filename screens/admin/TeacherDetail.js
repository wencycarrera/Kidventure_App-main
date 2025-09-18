import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../backend/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function TeacherDetail({ route, navigation }) {
  const { teacherId } = route.params;
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const docRef = doc(db, "teachers", teacherId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setTeacher(docSnap.data());
        else {
          if (Platform.OS === "web") window.alert("Teacher not found");
          else alert("Teacher not found");
        }
      } catch (error) {
        if (Platform.OS === "web") window.alert("Error: " + error.message);
        else alert("Error: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [teacherId]);

  if (loading) return <ActivityIndicator size="large" color="#FF7043" style={{ flex: 1 }} />;
  if (!teacher) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#FF7043" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Teacher Details</Text>

      {/* Fields same as TeacherRegister */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>Teacher ID</Text>
        <Text style={styles.value}>{teacher.teacherID}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.value}>{teacher.fullName}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Birthday</Text>
        <Text style={styles.value}>{teacher.birthday}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Age</Text>
        <Text style={styles.value}>{teacher.age}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Gender</Text>
        <Text style={styles.value}>{teacher.gender}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{teacher.email}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{teacher.role}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFDE7",
    flexGrow: 1,
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  backText: { marginLeft: 5, color: "#FF7043", fontSize: 16, fontWeight: "bold" },
  title: { fontSize: 28, fontWeight: "bold", color: "#FF7043", marginBottom: 20, textAlign: "center" },
  infoBox: {
    width: "100%",
    backgroundColor: "#FFCA28",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
  },
  label: { fontWeight: "bold", fontSize: 16, color: "#333", marginBottom: 5 },
  value: { fontSize: 16, color: "#333" },
});
