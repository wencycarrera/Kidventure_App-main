import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing } from "react-native";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function CountingExercise({ navigation, route }) {
  const MAX_NUMBER = 20;
  const [currentNumber, setCurrentNumber] = useState(1);
  const [confetti, setConfetti] = useState([]);

  const onComplete = route.params?.onComplete; // callback from ExercisesQ1

  const handleNumberPress = (num) => {
    if (num === currentNumber) {
      Speech.speak(num.toString());
      generateConfetti();
      setCurrentNumber(currentNumber + 1);
    }
  };

  const generateConfetti = () => {
    const newConfetti = Array.from({ length: 10 }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      emoji: ["🎉", "✨", "💖", "🌟", "🎈"][Math.floor(Math.random() * 5)],
      left: Math.random() * (width - 50),
      anim: new Animated.Value(0),
    }));
    setConfetti(newConfetti);

    newConfetti.forEach((item) => {
      Animated.timing(item.anim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        setConfetti((prev) => prev.filter((c) => c.id !== item.id));
      });
    });
  };

  // Generate number buttons
  const buttons = [];
  for (let i = 1; i <= MAX_NUMBER; i++) {
    buttons.push(
      <TouchableOpacity
        key={i}
        style={[
          styles.numberButton,
          i === currentNumber ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={() => handleNumberPress(i)}
      >
        <Text style={styles.numberText}>{i}</Text>
      </TouchableOpacity>
    );
  }

  if (currentNumber > MAX_NUMBER) {
    return (
      <View style={styles.completedContainer}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FF7043" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.completedTitle}>🎉 Exercise Completed! 🎉</Text>
        <Text style={styles.completedText}>You finished counting {MAX_NUMBER} numbers!</Text>

        {/* Next Lesson Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            if (onComplete) onComplete(); // unlock next exercise
            navigation.goBack(); // return to ExercisesQ1
          }}
        >
          <Text style={styles.buttonText}>Next Lesson</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#FF7043" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Counting Fun! 🎈</Text>
      <Text style={styles.subtitle}>Tap the next number in order</Text>

      <View style={styles.grid}>{buttons}</View>

      {confetti.map((c) => (
        <Animated.Text
          key={c.id}
          style={[
            styles.confetti,
            {
              left: c.left,
              transform: [
                {
                  translateY: c.anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -height / 2 - Math.random() * 100],
                  }),
                },
                {
                  rotate: c.anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", `${Math.random() * 360}deg`],
                  }),
                },
              ],
              fontSize: 30 + Math.random() * 20,
            },
          ]}
        >
          {c.emoji}
        </Animated.Text>
      ))}

      <Text style={styles.progressText}>
        Progress: {currentNumber - 1}/{MAX_NUMBER}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFFDE7", alignItems: "center" },
  backButton: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", marginBottom: 10 },
  backText: { marginLeft: 5, color: "#FF7043", fontSize: 16, fontWeight: "bold" },
  title: { fontSize: 28, fontWeight: "bold", color: "#FF7043", marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  numberButton: { width: 60, height: 60, margin: 5, borderRadius: 15, justifyContent: "center", alignItems: "center" },
  activeButton: { backgroundColor: "#4CAF50" },
  inactiveButton: { backgroundColor: "#BDBDBD" },
  numberText: { fontSize: 22, color: "#FFF", fontWeight: "bold" },
  confetti: { position: "absolute" },
  progressText: { fontSize: 18, marginTop: 20, color: "#FF7043" },
  completedContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFDE7", padding: 20 },
  completedTitle: { fontSize: 28, fontWeight: "bold", color: "#FF7043", marginBottom: 20, textAlign: "center" },
  completedText: { fontSize: 22, color: "#4CAF50", textAlign: "center", marginBottom: 20 },
  nextButton: { backgroundColor: "#FF7043", padding: 15, borderRadius: 20, width: "60%", alignItems: "center" },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold", textAlign: "center" },
});
