// frontend/screens/admin/StudentDetail.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../backend/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function StudentDetail({ route, navigation }) {
  const { studentId } = route.params;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const docRef = doc(db, "students", studentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStudent(docSnap.data());
        } else {
          alert("Student not found");
          navigation.goBack();
        }
      } catch (error) {
        alert("Error fetching student data: " + error.message);
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) return <ActivityIndicator size="large" color="#FF7043" style={{ flex: 1 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#FF7043" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Student Details</Text>

      {student && (
        <View style={styles.infoBox}>
          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>{student.fullName}</Text>

          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{student.age}</Text>

          <Text style={styles.label}>Birthday:</Text>
          <Text style={styles.value}>{student.birthday}</Text>

          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{student.gender}</Text>

          <Text style={styles.label}>Grade & Section:</Text>
          <Text style={styles.value}>{student.gradeSection}</Text>

          <Text style={styles.label}>Parent / Guardian:</Text>
          <Text style={styles.value}>{student.parentName}</Text>

          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.value}>{student.phoneNumber}</Text>

          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{student.address}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{student.email}</Text>

          <Text style={styles.label}>Enrollment Date:</Text>
          <Text style={styles.value}>{student.enrollmentDate}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#FFFDE7", flexGrow: 1 },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backText: { marginLeft: 5, color: "#FF7043", fontSize: 16, fontWeight: "bold" },
  title: { fontSize: 26, fontWeight: "bold", color: "#FF7043", marginBottom: 20, textAlign: "center" },
  infoBox: { backgroundColor: "#FFCA28", padding: 20, borderRadius: 15 },
  label: { fontWeight: "bold", fontSize: 16, marginTop: 10, color: "#333" },
  value: { fontSize: 16, marginTop: 2, color: "#000" },
});
