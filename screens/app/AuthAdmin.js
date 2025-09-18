import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../backend/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthAdmin({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Check for auto-login on mount
  useEffect(() => {
    const checkLogin = async () => {
      const storedAdmin = await AsyncStorage.getItem("adminLoggedIn");
      if (storedAdmin === "true") {
        navigation.replace("AdminDashboard");
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username),
        where("password", "==", password),
        where("role", "==", "admin")
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        // 🔹 Save login state
        await AsyncStorage.setItem("adminLoggedIn", "true");
        navigation.replace("AdminDashboard");
      } else {
        Alert.alert("Login Failed", "Invalid credentials or not an admin");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={24} color="#FF7043" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Admin Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
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
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#FF7043",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#FF7043",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
