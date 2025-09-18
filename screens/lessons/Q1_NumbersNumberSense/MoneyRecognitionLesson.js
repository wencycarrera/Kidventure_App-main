import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated } from "react-native";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons"; // <-- vector icons

const { width } = Dimensions.get("window");

// Define slides with icon names instead of emojis
const storySlides = [
  { id: 1, text: "Hello! I'm Coco the Cat. Today, we'll learn about money!", icon: "md-happy" },
  { id: 2, text: "Look! These are coins. This is 1 peso, this is 5 pesos.", icon: "md-cash" },
  { id: 3, text: "And here are bills. Can you recognize the 20 and 50 peso bills?", icon: "md-wallet" },
  { id: 4, text: "Great! Let's start a fun exercise to practice what you've learned!", icon: "md-trophy" },
];

export default function MoneyStoryLesson({ navigation }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();

    Speech.stop();
    Speech.speak(storySlides[currentSlide].text, { rate: 0.9 });

    const timer = setTimeout(() => {
      if (currentSlide < storySlides.length - 1) setCurrentSlide(currentSlide + 1);
      else navigation.navigate("Exercises", { exercise: "MoneyExercise" });
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  const handleBack = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Money Adventure!</Text>

      {/* Vector Icon in a circle */}
      <View style={styles.iconContainer}>
        <Ionicons name={storySlides[currentSlide].icon} size={60} color="#FF7043" />
      </View>

      <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
        {storySlides[currentSlide].text}
      </Animated.Text>

      <View style={styles.navigation}>
        {currentSlide > 0 && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backText}>⬅️ Back</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.progress}>
        Slide {currentSlide + 1}/{storySlides.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFDE7",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF7043",
    marginBottom: 30,
    textAlign: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  text: { fontSize: 20, textAlign: "center", marginBottom: 20, paddingHorizontal: 10 },
  navigation: { flexDirection: "row", marginBottom: 20 },
  backButton: { padding: 10 },
  backText: { fontSize: 18, color: "#FF7043" },
  progress: { fontSize: 16, color: "#FF7043", marginTop: 10 },
});
