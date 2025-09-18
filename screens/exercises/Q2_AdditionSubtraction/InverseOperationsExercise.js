import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const questions = [
  { question: "7 + 3 = ? What is the inverse operation?", options: ["7 - 3", "3 - 7", "7 + 3"], answer: "7 - 3" },
  { question: "10 - 4 = ? What is the inverse operation?", options: ["10 + 4", "4 + 10", "10 - 4"], answer: "10 + 4" }
];

export default function InverseOperationsExercise() {
  const [current, setCurrent] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleAnswer = (answer) => {
    const correct = questions[current].answer === answer;
    setIsCorrect(correct);

    // Animate feedback
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();

    setTimeout(() => {
      setIsCorrect(null);
      setCurrent(current + 1);
    }, 1000);
  };

  if (current >= questions.length)
    return (
      <View style={styles.completedContainer}>
        <Ionicons name="trophy-outline" size={80} color="#FF7043" />
        <Text style={styles.completedText}>Exercise Completed!</Text>
      </View>
    );

  const q = questions[current];

  return (
    <View style={styles.container}>
      {/* Vector icon instead of emoji */}
      <Ionicons name="calculator-outline" size={60} color="#4caf50" style={{ marginBottom: 20 }} />

      <Text style={styles.title}>{q.question}</Text>

      {q.options.map((opt, i) => (
        <TouchableOpacity key={i} style={styles.button} onPress={() => handleAnswer(opt)}>
          <Text style={styles.buttonText}>{opt}</Text>
        </TouchableOpacity>
      ))}

      {isCorrect !== null && (
        <Animated.Text style={[styles.feedback, { opacity: fadeAnim }]}>
          {isCorrect ? "✅ Correct!" : "❌ Wrong!"}
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#FFFDE7" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#FF7043" },
  button: { backgroundColor: "#4caf50", padding: 15, borderRadius: 15, marginBottom: 15, width: "70%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  feedback: { marginTop: 15, fontSize: 20, fontWeight: "bold" },
  completedContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFDE7" },
  completedText: { fontSize: 28, fontWeight: "bold", color: "#FF7043", textAlign: "center", marginTop: 20 },
});
