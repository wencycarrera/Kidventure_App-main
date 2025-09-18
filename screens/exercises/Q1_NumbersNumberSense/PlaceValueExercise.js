import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const questions = [
  { question: "What is the value of 3 in 34?", options: ["3","30","4"], answer:"30" },
  { question: "What is the value of 7 in 72?", options: ["70","7","2"], answer:"70" }
];

export default function PlaceValueExercise() {
  const [current, setCurrent] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleAnswer = (answer) => {
    setIsCorrect(questions[current].answer === answer);

    setTimeout(() => {
      setIsCorrect(null);
      setCurrent(current + 1);
    }, 800);
  };

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

  const q = questions[current];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{q.question}</Text>
      {q.options.map((opt, i) => (
        <TouchableOpacity key={i} style={styles.button} onPress={() => handleAnswer(opt)}>
          <Text style={styles.buttonText}>{opt}</Text>
        </TouchableOpacity>
      ))}
      {isCorrect !== null && (
        <Text style={[styles.feedback, { color: isCorrect ? "#4caf50" : "#f44336" }]}>
          {isCorrect ? "✅ Correct!" : "❌ Wrong!"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#FFFDE7" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  button: { backgroundColor: "#4caf50", padding: 15, borderRadius: 10, marginBottom: 10, width: "60%" },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  feedback: { marginTop: 10, fontSize: 18, fontWeight: "bold" },
  restartButton: { backgroundColor: "#FF7043", padding: 15, borderRadius: 10, marginTop: 20, width: "60%", alignItems: "center" }
});
