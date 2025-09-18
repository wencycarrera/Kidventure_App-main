import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function WordProblemLesson({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Word problem icon */}
      <MaterialCommunityIcons 
        name="book-open-page-variant" 
        size={100} 
        color="#4caf50" 
        style={{ marginBottom: 20 }} 
      />

      <Text style={styles.title}>Addition & Subtraction Word Problems</Text>
      <Text style={styles.description}>
        Solve one-step routine and non-routine problems, including money scenarios, using addition and subtraction.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("WordProblemExercise")}
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
    fontSize:24,
    fontWeight:"bold",
    marginBottom:15,
    textAlign:"center",
    color:"#388E3C"
  },
  description:{
    fontSize:16,
    marginBottom:30,
    textAlign:"center",
    color:"#555"
  },
  button:{
    flexDirection:"row",
    backgroundColor:"#388E3C",
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
