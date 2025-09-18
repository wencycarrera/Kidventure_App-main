import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from "react-native";
import { auth } from "../../backend/firebaseConfig";
import { updatePassword } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

export default function StudentSettings({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogout = () => {
    auth.signOut().then(() => navigation.replace("StudentLogin"));
  };

  const handleChangePassword = () => {
    if (!newPassword || !confirmPassword) return Alert.alert("Error", "Please fill all fields");
    if (newPassword !== confirmPassword) return Alert.alert("Error", "Passwords do not match");

    updatePassword(auth.currentUser, newPassword)
      .then(() => {
        Alert.alert("Success", "Password updated successfully!");
        setModalVisible(false);
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch(error => Alert.alert("Error", error.message));
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FFF" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("TeacherProfileEdit")}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      {/* Change Password Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Password</Text>

            <TextInput
              placeholder="New Password"
              secureTextEntry
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity style={styles.modalButton} onPress={handleChangePassword}>
              <Text style={styles.modalButtonText}>Update Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#CCC" }]} onPress={() => setModalVisible(false)}>
              <Text style={[styles.modalButtonText, { color: "#333" }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFFDE7", alignItems: "center" },
  backButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#FF7043", padding: 10, borderRadius: 10, alignSelf: "flex-start", marginBottom: 15 },
  backText: { color: "#FFF", fontWeight: "bold", marginLeft: 5 },
  title: { fontSize: 26, fontWeight: "bold", color: "#4CAF50", marginBottom: 30 },
  button: {
    width: "100%",
    backgroundColor: "#FFA726",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "85%", backgroundColor: "#FFF", borderRadius: 15, padding: 20 },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#4CAF50", textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#CCC", borderRadius: 10, padding: 15, marginVertical: 10 },
  modalButton: { backgroundColor: "#FFA726", padding: 15, borderRadius: 15, marginTop: 10, alignItems: "center" },
  modalButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
