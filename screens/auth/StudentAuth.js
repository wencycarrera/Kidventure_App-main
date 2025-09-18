// frontend/screens/student/StudentAuth.js
import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // back icon

export default function StudentAuth({ navigation }) {
  useEffect(() => {
    const backAction = () => {
      navigation.goBack(); // goes back to previous screen
      return true; // prevent default exit
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Custom Back Button */}
      <TouchableOpacity style={styles.backButton} 
      onPress={() => navigation.goBack("AuthMenu")}
      >
        
      <Ionicons name="arrow-back-outline" size={24} color="#FF7043" />
       <Text style={styles.backText}>Back</Text>
       </TouchableOpacity>

      <Text style={styles.title}>Welcome, Student!</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF7043" }]}
          onPress={() => navigation.navigate("StudentLogin")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FFCA28" }]}
          onPress={() => navigation.navigate("StudentRegister")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
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
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF7043",
    marginBottom: 50,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    width: 140,
    height: 140,
    marginHorizontal: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
});
