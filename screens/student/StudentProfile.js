import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, Image, TouchableOpacity } from "react-native";
import { db, auth } from "../../backend/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function StudentProfile({ route, navigation }) {
  const studentId = route.params?.studentId || auth.currentUser?.uid; // fallback to current user

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStudent = useCallback(async () => {
    if (!studentId) {
      Alert.alert("Error", "Student ID not provided!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, "students", studentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setStudent(docSnap.data());
      } else {
        Alert.alert("Error", "Student profile not found!", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error("Firestore fetch error:", error);
      Alert.alert("Error", "Failed to fetch student profile", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    }
    setLoading(false);
  }, [studentId, navigation]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#FFA726" />
        <Text style={{ marginTop: 10, color: "#FFA726", fontSize: 16 }}>Loading student profile...</Text>
      </View>
    );
  }

  if (!student) return null;

  const [grade, section] = student.gradeSection?.split(" - ") || ["N/A", "N/A"];
  const enrollmentDate = student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : "N/A";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#FF7043" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../../assets/images/pic.jpg")} style={styles.avatar} />
        <Text style={styles.name}>{student.fullName || "N/A"}</Text>
      </View>

      {/* Personal Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Information</Text>
        <View style={styles.row}><Text style={styles.label}>Full Name:</Text><Text style={styles.value}>{student.fullName || "N/A"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Birthday:</Text><Text style={styles.value}>{student.birthday || "N/A"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Age:</Text><Text style={styles.value}>{student.age || "N/A"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Gender:</Text><Text style={styles.value}>{student.gender || "N/A"}</Text></View>
      </View>

      {/* Academic Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Academic Information</Text>
        <View style={styles.row}><Text style={styles.label}>Grade & Section:</Text><Text style={styles.value}>{grade}</Text></View>
      </View>

      {/* Contact Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact Information</Text>
        <View style={styles.row}><Text style={styles.label}>Parent / Guardian:</Text><Text style={styles.value}>{student.parentName || "N/A"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Email:</Text><Text style={styles.value}>{student.email || "N/A"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Phone Number:</Text><Text style={styles.value}>{student.phoneNumber || "N/A"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Address:</Text><Text style={styles.value}>{student.address || "N/A"}</Text></View>
      </View>

      {/* Registration Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Registration Details</Text>
        <View style={styles.row}><Text style={styles.label}>Enrollment Date:</Text><Text style={styles.value}>{enrollmentDate}</Text></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#FFFDE7", alignItems: "center" },
  backButton: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", marginBottom: 15 },
  backText: { marginLeft: 5, color: "#FF7043", fontSize: 16, fontWeight: "bold" },
  header: { alignItems: "center", marginBottom: 30 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 15, borderWidth: 2, borderColor: "#FFA726" },
  name: { fontSize: 22, fontWeight: "bold", color: "#4CAF50" },
  card: { width: "100%", backgroundColor: "#FFF", borderRadius: 15, padding: 15, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#FF7043", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 5 },
  label: { fontSize: 16, fontWeight: "bold", color: "#555" },
  value: { fontSize: 16, color: "#333", maxWidth: "60%", textAlign: "right" },
});
