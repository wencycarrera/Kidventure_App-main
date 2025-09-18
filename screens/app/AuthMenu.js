import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ✅ icon for back button

export default function AuthMenu({ navigation }) {
  useEffect(() => {
    const backAction = () => {
      navigation.navigate("WelcomeScreen");
      return true; // prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate("WelcomeScreen")}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#FF7043" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Who is using this app?</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FFA726" }]}
          onPress={() => navigation.navigate("StudentAuth")}
        >
          <Text style={styles.buttonText}>Student</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#ce8541ff" }]}
          onPress={() => navigation.navigate("TeacherAuth")}
        >
          <Text style={styles.buttonText}>Teacher</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDE7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    marginLeft: 5,
    color: "#FF7043",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF7043",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  button: {
    width: 150,
    height: 150,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
});
