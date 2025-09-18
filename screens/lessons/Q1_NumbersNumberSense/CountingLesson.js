import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView } from "react-native";
import * as Speech from "expo-speech";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const storyScenes = [
  { text: "Good morning, Coco! Let's pick some apples.", count: 5, icon: "cat", iconColor: "#FF7043", objectIcon: "apple-alt", objectColor: "#FF0000" },
  { text: "Now, let's count the balloons.", count: 4, icon: "cat", iconColor: "#FF7043", objectIcon: "balloon", objectColor: "#2196F3" },
  { text: "Look at the twinkling stars.", count: 6, icon: "cat", iconColor: "#FF7043", objectIcon: "star", objectColor: "#FFD700" },
  { text: "Fantastic! You counted all the objects! Great job!", count: 0, icon: "cat", iconColor: "#FF7043", objectIcon: "", objectColor: "" }
];

export default function CountingStorybook({ navigation, route }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [fallingObjects, setFallingObjects] = useState([]);
  const [confetti, setConfetti] = useState([]);

  const scene = storyScenes[sceneIndex];

  useEffect(() => {
    Speech.stop();
    Speech.speak(scene.text, { rate: 0.9 });
    setCurrentCount(0);

    if (scene.count > 0) {
      const objects = [];
      for (let i = 0; i < scene.count; i++) {
        objects.push({ id: i, anim: new Animated.Value(-50), left: Math.random() * (width - 50) });
      }
      setFallingObjects(objects);

      objects.forEach(obj => {
        Animated.timing(obj.anim, {
          toValue: height / 2 - 50 + Math.random() * 50,
          duration: 1500 + Math.random() * 500,
          useNativeDriver: true,
        }).start();
      });
    } else {
      setFallingObjects([]);
      // Auto-navigate if last scene with count = 0
      if (sceneIndex === storyScenes.length - 1) {
        setTimeout(() => {
          if (route.params?.onComplete) route.params.onComplete(); // Unlock next lesson
          if (route.params?.nextLessonScreen) navigation.replace(route.params.nextLessonScreen);
        }, 1000);
      }
    }
  }, [sceneIndex]);

  const handleTap = (idx) => {
    if (idx === currentCount) {
      Speech.speak((currentCount + 1).toString());
      setCurrentCount(currentCount + 1);

      const newConfetti = Array.from({ length: 5 }).map((_, i) => ({
        id: `${Date.now()}-${i}`,
        emoji: ["🎉", "✨", "💖", "🌟"][Math.floor(Math.random() * 4)],
        left: Math.random() * (width - 50),
        anim: new Animated.Value(0),
      }));
      setConfetti(newConfetti);

      newConfetti.forEach(c => {
        Animated.timing(c.anim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => setConfetti(prev => prev.filter(cf => cf.id !== c.id)));
      });

      if (currentCount + 1 === scene.count) {
        setTimeout(() => {
          setSceneIndex(sceneIndex + 1);
        }, 500);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#FF7043" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Counting Storybook</Text>
      <FontAwesome5 name={scene.icon} size={80} color={scene.iconColor} style={{ marginBottom: 10 }} />

      <ScrollView style={{ maxHeight: 120 }}>
        <Text style={styles.storyText}>{scene.text}</Text>
      </ScrollView>

      <View style={styles.objectsContainer}>
        {fallingObjects.map((obj, idx) => (
          <TouchableOpacity key={obj.id} onPress={() => handleTap(idx)}>
            <Animated.View style={{ margin: 5, transform: [{ translateY: obj.anim }] }}>
              <FontAwesome5 name={scene.objectIcon} size={40} color={scene.objectColor} />
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>

      {scene.count > 0 && <Text style={styles.progress}>Progress: {currentCount}/{scene.count}</Text>}

      {confetti.map(c => (
        <Animated.Text
          key={c.id}
          style={{
            position: "absolute",
            left: c.left,
            top: height / 2,
            fontSize: 30 + Math.random() * 20,
            transform: [
              { translateY: c.anim.interpolate({ inputRange: [0,1], outputRange: [0,-200] }) },
              { rotate: c.anim.interpolate({ inputRange: [0,1], outputRange: ["0deg","360deg"] }) },
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
  container: { flex: 1, backgroundColor: "#FFFDE7", alignItems: "center", paddingTop: 50 },
  backButton: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", marginLeft: 20, marginBottom: 10 },
  backText: { marginLeft: 5, color: "#FF7043", fontSize: 16, fontWeight: "bold" },
  title: { fontSize: 26, fontWeight: "bold", color: "#FF7043", marginBottom: 20, textAlign: "center" },
  storyText: { fontSize: 20, color: "#333", textAlign: "center", paddingHorizontal: 10, lineHeight: 28 },
  objectsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", minHeight: 250, marginTop: 20 },
  progress: { fontSize: 18, color: "#FF7043", marginTop: 20 },
});
