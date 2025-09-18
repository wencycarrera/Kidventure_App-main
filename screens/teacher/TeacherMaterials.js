import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage, auth } from "../../backend/firebaseConfig";

export default function TeacherMaterials({ navigation }) {
  const [materials, setMaterials] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const materialsRef = collection(db, "teacherMaterials");

  // Fetch materials uploaded by this teacher
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      if (!auth.currentUser) throw new Error("User not logged in");
      const q = query(materialsRef, where("uploadedBy", "==", auth.currentUser.uid));
      const snapshot = await getDocs(q);
      setMaterials(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.log("Fetch error:", error);
      alert("Failed to fetch materials: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Pick only PDF files
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
      if (result.type === "cancel") return;
      setSelectedFile(result);
    } catch (error) {
      console.log("Picker error:", error);
      alert("Failed to select file: " + error.message);
    }
  };

  // Upload PDF directly to Firebase Storage
  const handleUpload = async () => {
    if (!selectedFile) return alert("No file selected");
    if (!title.trim()) return alert("Enter a title");

    setUploading(true);
    try {
      let blob;
      if (Platform.OS === "web") {
        blob = selectedFile; // File object for web
      } else {
        const response = await fetch(selectedFile.uri);
        blob = await response.blob();
      }

      const storageRef = ref(storage, `materials/${Date.now()}_${selectedFile.name}`);
      await uploadBytes(storageRef, blob); // Upload PDF
      const downloadURL = await getDownloadURL(storageRef); // Get download URL

      await addDoc(materialsRef, {
        title,
        content: content.trim(),
        fileName: selectedFile.name,
        url: downloadURL,
        uploadedBy: auth.currentUser.uid,
        uploadedAt: serverTimestamp(),
        storagePath: storageRef.fullPath,
        isActive: true,
      });

      alert("PDF uploaded successfully!");
      setTitle("");
      setContent("");
      setSelectedFile(null);
      fetchMaterials();
    } catch (error) {
      console.log("Upload error:", error);
      alert("Failed to upload PDF: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Delete material and its PDF from storage
  const handleDelete = async (item) => {
    Alert.alert(
      "Delete Material",
      `Are you sure you want to delete "${item.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "teacherMaterials", item.id));
              if (item.storagePath) {
                const fileRef = ref(storage, item.storagePath);
                await deleteObject(fileRef);
              }
              fetchMaterials();
            } catch (error) {
              console.log("Delete error:", error);
              alert("Failed to delete material: " + error.message);
            }
          },
        },
      ]
    );
  };

  // Open PDF in browser or default app
  const openFile = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      alert("Cannot open file: " + error.message);
    }
  };

  const renderItem = ({ item }) => {
    const date = item.uploadedAt?.toDate ? item.uploadedAt.toDate().toLocaleString() : "";
    return (
      <View style={styles.materialRow}>
        <Ionicons name="document-text-outline" size={24} color="#FF7043" style={{ marginRight: 12 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.materialTitle}>{item.title}</Text>
          {item.content ? <Text style={styles.materialContent}>{item.content}</Text> : null}
          <Text style={styles.materialFileName}>{item.fileName}</Text>
          {date ? <Text style={styles.uploadDate}>Uploaded: {date}</Text> : null}
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.viewButton} onPress={() => openFile(item.url)}>
            <Ionicons name="eye-outline" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
            <Ionicons name="trash-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={24} color="#FF7043" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Upload Teaching Materials (PDF)</Text>

      <TextInput
        style={styles.input}
        placeholder="Material Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Optional content or notes"
        value={content}
        onChangeText={setContent}
        multiline
      />

      <TouchableOpacity style={styles.pickFileButton} onPress={pickFile}>
        <Text style={styles.pickFileText}>
          {selectedFile ? selectedFile.name : "Choose PDF file"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.uploadButton, { opacity: !selectedFile || uploading ? 0.6 : 1 }]}
        onPress={handleUpload}
        disabled={!selectedFile || uploading}
      >
        {uploading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.uploadButtonText}>Upload PDF</Text>}
      </TouchableOpacity>

      <Text style={styles.listHeader}>Uploaded Materials</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF7043" style={{ marginTop: 30 }} />
      ) : materials.length === 0 ? (
        <Text style={styles.emptyText}>No materials uploaded yet.</Text>
      ) : (
        <FlatList
          data={materials}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFFDE7" },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  backButtonText: { color: "#FF7043", fontWeight: "bold", marginLeft: 5, fontSize: 16 },
  header: { fontSize: 22, fontWeight: "bold", color: "#FF7043", marginBottom: 15 },
  input: { backgroundColor: "#F1F1F1", borderRadius: 10, padding: 10, marginBottom: 10, fontSize: 16 },
  pickFileButton: { backgroundColor: "#FFA726", padding: 12, borderRadius: 10, marginBottom: 10, alignItems: "center" },
  pickFileText: { color: "#FFF", fontWeight: "bold" },
  uploadButton: { backgroundColor: "#03A9F4", padding: 12, borderRadius: 10, marginBottom: 20, alignItems: "center" },
  uploadButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  listHeader: { fontSize: 18, fontWeight: "bold", color: "#FF7043", marginBottom: 10 },
  emptyText: { textAlign: "center", marginTop: 30, color: "#888", fontSize: 16 },
  materialRow: { flexDirection: "row", alignItems: "center", marginBottom: 12, backgroundColor: "#F3E5F5", padding: 12, borderRadius: 10 },
  materialTitle: { fontSize: 16, fontWeight: "bold", color: "#6A1B9A" },
  materialContent: { fontSize: 14, color: "#4A148C", marginTop: 2 },
  materialFileName: { fontSize: 14, color: "#512DA8", marginTop: 2 },
  uploadDate: { fontSize: 12, color: "#333", marginTop: 2 },
  actionButtons: { flexDirection: "row", marginLeft: 10 },
  viewButton: { backgroundColor: "#9C27B0", padding: 8, borderRadius: 8, marginRight: 8 },
  deleteButton: { backgroundColor: "#E53935", padding: 8, borderRadius: 8 },
});
