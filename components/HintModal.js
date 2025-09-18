import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HintModal({ visible, onClose, hint }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Hint</Text>
          <Text style={styles.text}>{hint}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modal: { width: "80%", padding: 20, backgroundColor: "#fff", borderRadius: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 20 },
  button: { backgroundColor: "#4caf50", padding: 10, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
