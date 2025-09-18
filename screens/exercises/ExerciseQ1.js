import React, { useRef, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../backend/firebaseConfig";

const { width } = Dimensions.get("window");
const cardWidth = width - 40;
const cardHeight = 180;

export default function ExercisesQ1({ navigation, route }) {
  const studentId = route.params?.studentId;

  const [completedExercises, setCompletedExercises] = useState([]);
  const [celebrateIndex, setCelebrateIndex] = useState(null);
  const [confetti, setConfetti] = useState([]);

  const exercises = [
    { id: "exercise1", label: "Counting Exercise", icon: "calculator-outline" },
    { id: "exercise2", label: "Ordering Exercise", icon: "swap-vertical-outline" },
    { id: "exercise3", label: "Comparing Numbers Exercise", icon: "git-compare-outline" },
    { id: "exercise4", label: "Ordinal Numbers Exercise", icon: "list-outline" },
    { id: "exercise5", label: "Place Value Exercise", icon: "cube-outline" },
    { id: "exercise6", label: "Skip Counting Exercise", icon: "trending-up-outline" },
    { id: "exercise7", label: "Money Exercise", icon: "cash-outline" },
  ];

  const animatedValues = useRef(exercises.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = exercises.map((_, i) =>
      Animated.timing(animatedValues[i], { toValue: 1, duration: 500, useNativeDriver: true, delay: i * 150 })
    );
    Animated.stagger(100, animations).start();
  }, []);

  const handleExerciseComplete = async (index) => {
    setCelebrateIndex(index);

    // Update Firestore progress
    try {
      const docRef = doc(db, "students", studentId);
      await updateDoc(docRef, { [`progress.${exercises[index].id}`]: 1 });
    } catch (error) {
      console.log("Error updating progress:", error);
    }

    setCompletedExercises(prev => [...prev, index]);

    // Confetti animation
    const newConfetti = Array.from({ length: 10 }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      emoji: ["🎉", "✨", "💖", "🌟"][Math.floor(Math.random() * 4)],
      left: Math.random() * (width - 50),
      anim: new Animated.Value(0),
    }));
    setConfetti(newConfetti);
    newConfetti.forEach(c => {
      Animated.timing(c.anim, { toValue: 1, duration: 1000, useNativeDriver: true }).start(() =>
        setConfetti(prev => prev.filter(cf => cf.id !== c.id))
      );
    });
  };

  const renderItem = ({ item, index }) => {
    const isLocked = index > 0 && !completedExercises.includes(index - 1) && celebrateIndex !== index;
    const isCelebrating = celebrateIndex === index;

    return (
      <Animated.View style={{ opacity: animatedValues[index] }}>
        <TouchableOpacity
          style={[styles.card, isLocked && styles.lockedCard]}
          onPress={() => { if (!isLocked && !isCelebrating) handleExerciseComplete(index); }}
        >
          <Ionicons name={item.icon} size={50} color={isLocked ? "#aaa" : "#000"} style={styles.icon} />
          <Text style={[styles.cardText, isLocked && { color: "#aaa" }]}>{item.label}</Text>

          {isLocked && <Text style={styles.lockedText}>Locked 🔒</Text>}

          {isCelebrating && (
            <View style={styles.finishedContainer}>
              <FontAwesome5 name="trophy" size={80} color="#FFD700" />
              <Text style={styles.finishedText}>Great Job!</Text>
              <TouchableOpacity style={styles.button} onPress={() => setCelebrateIndex(null)}>
                <Text style={styles.buttonText}>Next Exercise</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#FF7043" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      {confetti.map(c => (
        <Animated.Text
          key={c.id}
          style={{
            position: "absolute",
            left: c.left,
            top: 200,
            fontSize: 30 + Math.random() * 20,
            transform: [
              { translateY: c.anim.interpolate({ inputRange: [0, 1], outputRange: [0, -200] }) },
              { rotate: c.anim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) },
            ],
          }}
        >
          {c.emoji}
        </Animated.Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: { flexDirection: "row", alignItems: "center", marginLeft: 20, marginVertical: 10 },
  backText: { marginLeft: 5, color: "#FF7043", fontSize: 16, fontWeight: "bold" },
  container: { padding: 20, paddingBottom: 50 },
  card: { backgroundColor: "#FF7043", width: cardWidth, height: cardHeight, borderRadius: 20, marginBottom: 15, justifyContent: "center", alignItems: "center", padding: 15 },
  lockedCard: { backgroundColor: "#FFDAB3" },
  icon: { marginBottom: 15 },
  cardText: { color: "#000", fontSize: 18, fontWeight: "bold", textAlign: "center" },
  lockedText: { marginTop: 10, color: "#aaa", fontSize: 14 },
  finishedContainer: { alignItems: "center", marginTop: 10 },
  finishedText: { fontSize: 24, fontWeight: "bold", color: "#FFD700", marginVertical: 10 },
  button: { backgroundColor: "#FF7043", padding: 12, borderRadius: 20, alignItems: "center", marginTop: 10, width: "60%" },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold", textAlign: "center" },
});
