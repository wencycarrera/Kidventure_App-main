import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function InverseOperationsLesson({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Fun vector icon at top */}
      <MaterialCommunityIcons 
        name="swap-horizontal-bold" 
        size={100} 
        color="#2196f3" 
        style={{ marginBottom: 20 }} 
      />

      <Text style={styles.title}>Inverse Operations</Text>
      <Text style={styles.description}>
        Learn how addition and subtraction are inversely related through interactive exercises.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("InverseOperationsExercise")}
      >
        <MaterialCommunityIcons name="play-circle" size={24} color="#fff" style={{ marginRight: 10 }} />
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
    backgroundColor: "#E3F2FD"
  },
  title:{ 
    fontSize:26,
    fontWeight:"bold",
    marginBottom:15,
    textAlign:"center",
    color: "#2196f3"
  },
  description:{ 
    fontSize:16,
    marginBottom:30,
    textAlign:"center",
    color:"#555"
  },
  button:{ 
    flexDirection: "row",
    backgroundColor:"#2196f3",
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
