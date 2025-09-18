import React, { useEffect, useState, useCallback } from "react";
import { 
  View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, Image, TouchableOpacity
} from "react-native";
import { auth, db } from "../../backend/firebaseConfig";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

export default function TeacherProfile({ navigation }) {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTeacher = useCallback(async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "teachers", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setTeacher(docSnap.data());
      else Alert.alert("Error", "Teacher profile not found!");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to fetch teacher profile");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchTeacher(); }, [fetchTeacher]);

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "teachers", auth.currentUser.uid));
              await deleteUser(auth.currentUser);
              Alert.alert("Deleted", "Your account has been deleted.");
              navigation.replace("TeacherLogin");
            } catch (error) {
              console.log(error);
              Alert.alert("Error", "Failed to delete account. You may need to re-login.");
            }
          },
        },
      ]
    );
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} color="#FF7043" />;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={24} color="#FFF" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>Teacher Profile</Text>

        <Image
          source={require("../../assets/images/pic.jpg")}
          style={styles.avatar}
        />

        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{teacher.fullName}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{teacher.email}</Text>

          <Text style={styles.label}>Age</Text>
          <Text style={styles.value}>{teacher.age || "N/A"}</Text>

          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>{teacher.gender || "N/A"}</Text>

          <Text style={styles.label}>Birthday</Text>
          <Text style={styles.value}>{teacher.birthday || "N/A"}</Text>
        </View>

        {/* Delete Account */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: "#E53935", marginTop: 10 }]} 
          onPress={handleDeleteAccount}
        >
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, padding: 20, backgroundColor: "#FFFDE7", alignItems: "center" },
  backButton: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", marginBottom: 15, backgroundColor: "#FF7043", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  backButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16, marginLeft: 5 },
  container: { width: "100%", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#FF7043", marginBottom: 20, textAlign: "center" },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 20, borderWidth: 2, borderColor: "#FF7043" },
  card: { width: "100%", backgroundColor: "#FFF", borderRadius: 15, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  label: { fontSize: 16, fontWeight: "bold", color: "#FF7043", marginTop: 10 },
  value: { fontSize: 16, color: "#333", marginTop: 2 },
  button: { backgroundColor: "#FF7043", padding: 15, borderRadius: 20, alignItems: "center", width: "100%" },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});
