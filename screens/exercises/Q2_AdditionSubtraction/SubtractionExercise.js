import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { getExercisesByLesson } from "../../../backend/exercisesService";
import { saveProgress } from "../../../backend/progressService";
import { Ionicons } from "@expo/vector-icons";

export default function SubtractionExercise() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const lessonId = "Subtraction";

  useEffect(() => {
    const fetchExercises = async () => {
      const data = await getExercisesByLesson(lessonId);
      setQuestions(data);
    };
    fetchExercises();
  }, []);

  const handleAnswer = async (answer) => {
    const correct = questions[current]?.answer === answer;
    setIsCorrect(correct);
    await saveProgress("demoStudentId", lessonId, correct ? 100 : 0);

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
        <Text style={styles.completedText}>🎉 Exercise Completed! 🎉</Text>
      </View>
    );

  const question = questions[current] || { question: "Loading...", options: [], answer: null };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question.question}</Text>

      {question.options?.map((opt, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionButton}
          onPress={() => handleAnswer(opt)}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}

      {isCorrect !== null && (
        <Animated.View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, opacity: fadeAnim }}>
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
  container: {
    flex: 1,
    backgroundColor: "#FFFDE7",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  question: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF7043",
    marginBottom: 30,
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    width: "70%",
    alignItems: "center",
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  completedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFDE7",
  },
  completedText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF7043",
    textAlign: "center",
    marginTop: 20,
  },
});
