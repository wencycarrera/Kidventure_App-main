import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../backend/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function StudentListScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all students from Firestore
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      const studentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
      Alert.alert("Error", "Failed to load students");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 🔹 Delete student with confirmation
 const handleDelete = (id, name) => {
  Alert.alert(
    "Confirm Delete",
    `Are you sure you want to delete ${name}?`,
    [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "students", id));
            Alert.alert("Deleted", `${name} has been removed successfully`);
            // Remove deleted student from state
            setStudents(prev => prev.filter(student => student.id !== id));
          } catch (error) {
            console.error("Delete error:", error);
            Alert.alert("Error", "Failed to delete student. Check Firestore rules.");
          }
        } 
      }
    ]
  );
};


  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} color="#FF7043" />;

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFDE7" }}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FF7043" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              onPress={() => navigation.navigate("StudentProfile", { studentId: item.id })}
              style={{ flex: 1 }}
            >
              <Text style={styles.name}>{item.fullName}</Text>
              <Text style={styles.info}>Grade {item.grade} - Section {item.section}</Text>
            </TouchableOpacity>

            {/* Delete button */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id, item.fullName)}
            >
              <Ionicons name="trash-outline" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFFDE7",
    borderBottomWidth: 1,
    borderBottomColor: "#FF7043",
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#FF7043",
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFECB3",
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  name: { fontSize: 18, fontWeight: "bold", color: "#FF7043" },
  info: { fontSize: 14, color: "#555", marginTop: 3 },
  deleteButton: {
    backgroundColor: "#E53935",
    padding: 8,
    borderRadius: 10,
    marginLeft: 10,
  },
});
