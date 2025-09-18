import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../backend/firebaseConfig";

const { width } = Dimensions.get("window");
const cardWidth = width - 40;
const cardHeight = 180;

export default function LessonsQ1({ navigation, route }) {
  const studentId = route.params?.studentId;

  const lessons = [
    { id: "lesson1", label: "Counting & Number Visualization (0–100)", icon: "calculator-outline" },
    { id: "lesson2", label: "Ordering Numbers (0–100)", icon: "swap-vertical-outline" },
    { id: "lesson3", label: "Comparing Numbers Using >, <, =", icon: "git-compare-outline" },
    { id: "lesson4", label: "Ordinal Numbers (1st–10th)", icon: "list-outline" },
    { id: "lesson5", label: "Place Value & Renaming Numbers", icon: "cube-outline" },
    { id: "lesson6", label: "Skip Counting by 2s, 5s, 10s", icon: "trending-up-outline" },
    { id: "lesson7", label: "Money Recognition (Coins & Bills)", icon: "cash-outline" },
  ];

  const animatedValues = useRef(lessons.map(() => new Animated.Value(0))).current;
  const [unlocked, setUnlocked] = useState([true, false, false, false, false, false, false]);

  // Fetch progress from Firestore to unlock lessons properly
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const docRef = doc(db, "students", studentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const progress = docSnap.data()?.progress || {};
          const newUnlocked = lessons.map((lesson, index) => {
            if (index === 0) return true;
            const prevLesson = lessons[index - 1].id;
            return progress[prevLesson] === 1; // unlock if previous lesson completed
          });
          setUnlocked(newUnlocked);
        }
      } catch (error) {
        console.log("Error fetching progress:", error);
      }
    };

    fetchProgress();

    // Animate cards
    const animations = lessons.map((_, i) =>
      Animated.timing(animatedValues[i], { toValue: 1, duration: 500, useNativeDriver: true, delay: i * 150 })
    );
    Animated.stagger(100, animations).start();
  }, []);

  const handleLessonPress = async (index) => {
    if (!unlocked[index]) return;

    try {
      const docRef = doc(db, "students", studentId);
      // Mark lesson as complete
      await updateDoc(docRef, { [`progress.${lessons[index].id}`]: 1 });

      // Unlock next lesson if exists
      if (index + 1 < unlocked.length) {
        const newUnlocked = [...unlocked];
        newUnlocked[index + 1] = true;
        setUnlocked(newUnlocked);
      }

      // Navigate to the lesson screen
      navigation.navigate(lessons[index].id, { studentId });
    } catch (error) {
      console.log("Error updating progress:", error);
    }
  };

  const renderItem = ({ item, index }) => (
    <Animated.View style={{ opacity: animatedValues[index] }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: unlocked[index] ? "#FFA726" : "#CCC" }]}
        onPress={() => handleLessonPress(index)}
        disabled={!unlocked[index]}
      >
        <Ionicons name={item.icon} size={50} color={unlocked[index] ? "#000" : "#888"} style={styles.icon} />
        <Text style={[styles.cardText, { color: unlocked[index] ? "#000" : "#666" }]}>{item.label}</Text>
        {!unlocked[index] && <Text style={styles.lockText}>🔒 Locked</Text>}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFDE7" }}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#FF7043" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", margin: 20 },
  backText: { marginLeft: 5, color: "#FF7043", fontSize: 16, fontWeight: "bold" },
  container: { padding: 20, paddingBottom: 50 },
  card: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: 20,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    position: "relative",
  },
  icon: { marginBottom: 15 },
  cardText: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  lockText: { position: "absolute", bottom: 10, fontSize: 16, color: "#555" },
});
