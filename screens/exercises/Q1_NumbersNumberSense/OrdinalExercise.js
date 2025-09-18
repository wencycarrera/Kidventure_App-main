import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getExercisesByLesson } from "../../../backend/exercisesService";
import { saveProgress } from "../../../backend/progressService";
import FeedbackMessage from "../../../components/FeedbackMessage";

export default function OrdinalExercise() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);

  const lessonId = "OrdinalNumbers"; // lesson identifier

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercisesByLesson(lessonId);
        setQuestions(data);
      } catch (error) {
        console.log("Error fetching exercises:", error);
        Alert.alert("Error", "Failed to load exercises.");
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const handleAnswer = async (answer) => {
    const correct = questions[current]?.answer === answer;
    setIsCorrect(correct);

    try {
      await saveProgress("demoStudentId", lessonId, correct ? 100 : 0); // replace with real student ID
    } catch (error) {
      console.log("Error saving progress:", error);
    }

    setTimeout(() => {
      setIsCorrect(null);
      setCurrent(current + 1);
    }, 1000);
  };

  if (loading) return <Text style={styles.title}>Loading exercises...</Text>;

  if (current >= questions.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎉 Exercise Completed!</Text>
        <TouchableOpacity style={styles.restartButton} onPress={() => setCurrent(0)}>
          <Text style={styles.buttonText}>Restart Exercise</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const question = questions[current] || { question: "Loading...", options: [], answer: null };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{question.question}</Text>
      {question.options?.map((opt, index) => (
        <TouchableOpacity key={index} style={styles.button} onPress={() => handleAnswer(opt)}>
          <Text style={styles.buttonText}>{opt}</Text>
        </TouchableOpacity>
      ))}
      {isCorrect !== null && <FeedbackMessage isCorrect={isCorrect} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#FFFDE7" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  button: { backgroundColor: "#4caf50", padding: 15, borderRadius: 10, marginBottom: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  restartButton: { backgroundColor: "#FF7043", padding: 15, borderRadius: 10, marginTop: 20, alignItems: "center" }
});
