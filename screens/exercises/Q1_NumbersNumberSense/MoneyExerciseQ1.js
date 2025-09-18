import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getExercisesByLesson } from "../../../backend/exercisesService";
import { saveProgress } from "../../../backend/progressService";
import FeedbackMessage from "../../../components/FeedbackMessage";

export default function MoneyExerciseQ1() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);

  const lessonId = "MoneyRecognition";

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
    setTimeout(() => {
      setIsCorrect(null);
      setCurrent(current + 1);
    }, 1000);
  };

  if (current >= questions.length) return <Text style={styles.title}>Exercise Completed!</Text>;

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
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  button: { backgroundColor: "#4caf50", padding: 15, borderRadius: 10, marginBottom: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
