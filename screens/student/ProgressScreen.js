import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../backend/firebaseConfig";
import { ProgressBar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export default function ProgressScreen({ navigation, route }) {
  const studentId = route.params?.studentId;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const lessons = [
    { id: "lesson1", title: "Counting & Number Visualization", screen: "CountingLesson" },
    { id: "lesson2", title: "Ordering & Comparing Numbers", screen: "OrderingComparingLesson" },
    { id: "lesson3", title: "Comparing Numbers Using >, <, =", screen: "OrderingComparingLesson" },
    { id: "lesson4", title: "Ordinal Numbers", screen: "OrdinalLesson" },
    { id: "lesson5", title: "Place Value & Renaming Numbers", screen: "PlaceValueLesson" },
    { id: "lesson6", title: "Skip Counting by 2s, 5s, 10s", screen: "SkipCountingLesson" },
    { id: "lesson7", title: "Money Recognition", screen: "MoneyRecognitionLesson" },
  ];

  const exercises = [
    { id: "exercise1", title: "Counting Exercise", screen: "CountingExercise" },
    { id: "exercise2", title: "Ordering Exercise", screen: "OrderingExercise" },
    { id: "exercise3", title: "Comparing Numbers Exercise", screen: "OrderingComparingExercise" },
    { id: "exercise4", title: "Ordinal Exercise", screen: "OrdinalExercise" },
    { id: "exercise5", title: "Place Value Exercise", screen: "PlaceValueExercise" },
    { id: "exercise6", title: "Skip Counting Exercise", screen: "SkipCountingExercise" },
    { id: "exercise7", title: "Money Exercise", screen: "MoneyExercise" },
  ];

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const docRef = doc(db, "students", studentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStudent(docSnap.data());
        } else {
          console.log("No such student!");
        }
      } catch (error) {
        console.log("Error fetching student:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [studentId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF7043" />
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Student data not found.</Text>
      </View>
    );
  }

  const handleNavigate = (item) => {
    // Navigate to Lessons or Exercises screen with selected item
    const isLesson = item.id.startsWith("lesson");
    if (isLesson) {
      navigation.navigate("LessonsQ1", {
        selectedLessonId: item.id,
        studentId: studentId,
      });
    } else {
      navigation.navigate("ExerciseQ1", {
        selectedExerciseId: item.id,
        studentId: studentId,
      });
    }
  };

  const renderProgressItem = ({ item }) => {
    const progress = student.progress?.[item.id] || 0;

    return (
      <TouchableOpacity style={styles.card} onPress={() => handleNavigate(item)}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <ProgressBar progress={progress} color="#FF7043" style={styles.progressBar} />
        <Text style={styles.progressText}>{Math.round(progress * 100)}% done</Text>
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

      <Text style={styles.title}>Progress of {student.fullName}</Text>

      <Text style={styles.sectionHeader}>Lessons</Text>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id}
        renderItem={renderProgressItem}
        scrollEnabled={false}
      />

      <Text style={styles.sectionHeader}>Exercises</Text>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={renderProgressItem}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFFDE7" },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backText: { marginLeft: 5, color: "#FF7043", fontSize: 16, fontWeight: "bold" },
  title: { fontSize: 22, fontWeight: "bold", color: "#FF7043", textAlign: "center", marginBottom: 20 },
  sectionHeader: { fontSize: 20, fontWeight: "bold", color: "#6A1B9A", marginVertical: 10 },
  errorText: { fontSize: 18, color: "red", textAlign: "center" },
  card: { backgroundColor: "#F3E5F5", padding: 15, borderRadius: 15, marginBottom: 15 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#6A1B9A", marginBottom: 5 },
  progressBar: { height: 10, borderRadius: 5, marginBottom: 5 },
  progressText: { fontSize: 14, color: "#6A1B9A", textAlign: "right" },
});
