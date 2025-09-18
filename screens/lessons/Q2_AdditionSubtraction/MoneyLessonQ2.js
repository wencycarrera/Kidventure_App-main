import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function MoneyLessonQ2({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Coin icon */}
      <MaterialCommunityIcons 
        name="currency-php" 
        size={100} 
        color="#FFD700" 
        style={{ marginBottom: 20 }} 
      />

      <Text style={styles.title}>Money-based Addition & Subtraction</Text>
      <Text style={styles.description}>
        Learn to add and subtract coins and bills (up to PhP100) using visual aids and real-life scenarios.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MoneyExerciseQ2")}
      >
        <MaterialCommunityIcons 
          name="play-circle" 
          size={24} 
          color="#fff" 
          style={{ marginRight: 10 }} 
        />
        <Text style={styles.buttonText}>Start Exercise</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    padding:20,
    backgroundColor: "#E8F5E9"
  },
  title:{
    fontSize:26,
    fontWeight:"bold",
    marginBottom:15,
    textAlign:"center",
    color:"#4caf50"
  },
  description:{
    fontSize:16,
    marginBottom:30,
    textAlign:"center",
    color:"#555"
  },
  button:{
    flexDirection:"row",
    backgroundColor:"#4caf50",
    padding:15,
    borderRadius:20,
    width:"70%",
    justifyContent:"center",
    alignItems:"center"
  },
  buttonText:{
    color:"#fff",
    fontWeight:"bold",
    fontSize:18
  }
});
