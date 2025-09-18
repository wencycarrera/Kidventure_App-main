import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SubtractionLesson({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Subtract icon */}
      <MaterialCommunityIcons 
        name="minus-box-outline" 
        size={100} 
        color="#FF7043" 
        style={{ marginBottom: 20 }} 
      />

      <Text style={styles.title}>Subtraction (1–2 digits)</Text>
      <Text style={styles.description}>
        Practice subtraction with or without regrouping.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Exercises", { exercise: "SubtractionExercise" })}
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
    backgroundColor: "#FFF3E0"
  },
  title:{
    fontSize:26,
    fontWeight:"bold",
    marginBottom:15,
    textAlign:"center",
    color:"#FF7043"
  },
  description:{
    fontSize:16,
    marginBottom:30,
    textAlign:"center",
    color:"#555"
  },
  button:{
    flexDirection:"row",
    backgroundColor:"#FF7043",
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
