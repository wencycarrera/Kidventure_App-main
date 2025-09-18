import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const questions = [
  { question: "Add PhP 5 + PhP 10 = ?", options: ["10", "15", "20"], answer: "15" },
  { question: "Add PhP 20 + PhP 50 = ?", options: ["60", "70", "80"], answer: "70" }
];

export default function MoneyExerciseQ2() {
  const [current, setCurrent] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleAnswer = (answer) => {
    const correct = questions[current].answer === answer;
    setIsCorrect(correct);

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
      {/* Optional icon for exercise */}
      <Ionicons name="cash-outline" size={60} color="#4caf50" style={{ marginBottom: 20 }} />

      <Text style={styles.title}>{q.question}</Text>

      {q.options.map((opt, i) => (
        <TouchableOpacity key={i} style={styles.button} onPress={() => handleAnswer(opt)}>
          <Text style={styles.buttonText}>{opt}</Text>
        </TouchableOpacity>
      ))}

      {isCorrect !== null && (
        <Animated.View style={{ flexDirection: "row", alignItems: "center", marginTop: 15, opacity: fadeAnim }}>
          <Ionicons
            name={isCorrect ? "checkmark-circle-outline" : "close-circle-outline"}
            size={36}
            color={isCorrect ? "#4caf50" : "#f44336"}
            style={{ marginRight: 10 }}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold", color: isCorrect ? "#4caf50" : "#f44336" }}>
            {isCorrect ? "Correct!" : "Wrong!"}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#FFFDE7" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "#FF7043" },
  button: { backgroundColor: "#4caf50", padding: 15, borderRadius: 10, marginBottom: 10, width: "60%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  completedContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFDE7" },
  completedText: { fontSize: 28, fontWeight: "bold", color: "#FF7043", marginTop: 20, textAlign: "center" },
});
