import React, { useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Animated 
} from "react-native";

export default function WelcomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current; // initial opacity 0

  // Fade in when screen loads
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800, // fade-in duration
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Logo press navigates to AdminAuth
  const handleLogoPress = () => {
    navigation.navigate("AuthAdmin");
  };

  // "Get Started" button press
  const handlePress = () => {
    Animated.timing(fadeAnim, {
      toValue: 0, // fade out before navigating
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate("AuthMenu");
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <TouchableOpacity onPress={handleLogoPress}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Text style={styles.title}>Welcome to KidVenture!</Text>
      <Text style={styles.subtitle}>
        Learn Math in a Fun and Interactive Way!
      </Text>

      <TouchableOpacity style={styles.startButton} onPress={handlePress}>
        <Text style={styles.startButtonText}>Get Started</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBCC",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF7043",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 22,
    color: "#6C5B7B",
    textAlign: "center",
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: "#f05252e3",
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
});
