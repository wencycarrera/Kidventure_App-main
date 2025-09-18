import React, { useState, useEffect } from "react";
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, FlatList, Modal, Switch, TextInput, Platform, StatusBar 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import { db, auth } from "../../backend/firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";

export default function TeacherActivities({ navigation }) {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState("");
  const [activityType, setActivityType] = useState("Counting & Number Visualization");
  const [activityDate, setActivityDate] = useState("");
  const [editingActivity, setEditingActivity] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const activitiesRef = collection(db, "teacherActivities");

  // Fetch activities
  const fetchActivities = async () => {
    try {
      const snapshot = await getDocs(activitiesRef);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const now = new Date();
      const futureActivities = data.filter(a => new Date(a.activityDate) >= now);
      setActivities(futureActivities);
    } catch (error) {
      console.log("Error fetching activities:", error);
      alert("Failed to fetch activities");
    }
  };

  useEffect(() => { fetchActivities(); }, []);

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const dateObj = new Date(dateString);
    return dateObj.toLocaleString("en-US", { 
      year: "numeric", month: "short", day: "numeric", 
      hour: "2-digit", minute: "2-digit" 
    });
  };

  // Save or update activity
  const handleSaveActivity = async () => {
    if (!newActivity.trim() || !activityDate) {
      return alert("Please enter activity title and date");
    }

    try {
      const userId = auth.currentUser ? auth.currentUser.uid : "unknown";
      const activityData = {
        title: newActivity,
        type: activityType,
        activityDate,
        createdBy: userId,
        createdAt: serverTimestamp(),
        active: true,
        materials: [],
      };

      let savedActivity = null;

      if (editingActivity) {
        const activityDoc = doc(db, "teacherActivities", editingActivity.id);
        await updateDoc(activityDoc, activityData);
        savedActivity = { id: editingActivity.id, ...activityData };
        alert(`${newActivity} updated`);
      } else {
        const docRef = await addDoc(activitiesRef, activityData);
        savedActivity = { id: docRef.id, ...activityData };
        alert(`${newActivity} added`);
      }

      setNewActivity("");
      setActivityType("Counting & Number Visualization");
      setActivityDate("");
      setEditingActivity(null);
      setModalVisible(false);

      setActivities(prev => editingActivity 
        ? prev.map(a => a.id === editingActivity.id ? savedActivity : a)
        : [...prev, savedActivity]
      );
    } catch (error) {
      console.log("Error saving activity:", error);
      alert("Failed to save activity");
    }
  };

  // Delete activity
  const handleDeleteActivity = async (id) => {
    if (Platform.OS === "web") {
      if (!window.confirm("Are you sure you want to delete this activity?")) return;
    } else {
      const confirmed = await new Promise(resolve => {
        Alert.alert("Delete Activity", "Are you sure?", [
          { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
          { text: "Delete", style: "destructive", onPress: () => resolve(true) }
        ]);
      });
      if (!confirmed) return;
    }

    try {
      await deleteDoc(doc(db, "teacherActivities", id));
      setActivities(prev => prev.filter(a => a.id !== id));
      alert("Activity removed");
    } catch (error) {
      console.log("Error deleting activity:", error);
      alert("Failed to delete activity");
    }
  };

  // Toggle active state
  const toggleActive = async (activity) => {
    try {
      const activityDoc = doc(db, "teacherActivities", activity.id);
      await updateDoc(activityDoc, { active: !activity.active });
      setActivities(prev => prev.map(a => a.id === activity.id ? { ...a, active: !a.active } : a));
    } catch (error) {
      console.log("Error toggling activity:", error);
      alert("Failed to update activity status");
    }
  };

  const activityTypes = [
    "Counting & Number Visualization",
    "Ordering & Comparing Numbers",
    "Ordinal Numbers (1st–10th)",
    "Place Value & Renaming Numbers",
    "Skip Counting (2s, 5s, 10s)",
    "Money Recognition (coins & bills up to PhP100)",
    "Word Problems / Application"
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFDE7" }}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#FFF" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingTop: 90, paddingHorizontal: 20, paddingBottom: 50 }}>
        <Text style={styles.title}>Teacher Activities</Text>

        {/* Create Activity Button */}
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Create Activity</Text>
        </TouchableOpacity>

        {/* Activities List */}
        <View style={{ marginBottom: 25 }}>
          {Array.isArray(activities) && activities.length > 0 ? (
            <FlatList
              data={activities.sort((a,b) => new Date(a.activityDate) - new Date(b.activityDate))}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.activityRow}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={styles.buttonText}>
                      {item.title} ({item.type}) {item.active ? "[Active]" : "[Inactive]"}
                    </Text>
                    <Text style={styles.dateText}>Activity Date: {formatDateTime(item.activityDate)}</Text>
                  </View>

                  <Switch
                    value={item.active}
                    onValueChange={() => toggleActive(item)}
                    trackColor={{ false: "#BDBDBD", true: "#4CAF50" }}
                    thumbColor="#FFF"
                    style={{ marginRight: 5 }}
                  />

                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      setEditingActivity(item);
                      setNewActivity(item.title);
                      setActivityType(item.type);
                      setActivityDate(item.activityDate);
                      setModalVisible(true);
                    }}
                  >
                    <Ionicons name="pencil-outline" size={20} color="#FFF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteActivity(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <Text style={{ color:"#888", marginTop:10 }}>No upcoming activities.</Text>
          )}
        </View>

        {/* Modal */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{editingActivity ? "Edit Activity" : "Create Activity"}</Text>

              <Text style={styles.label}>Activity Title:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter title"
                value={newActivity}
                onChangeText={setNewActivity}
              />

              <Text style={styles.label}>Activity Type:</Text>
              {Platform.OS !== "web" ? (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={activityType}
                    onValueChange={setActivityType}
                  >
                    {activityTypes.map((type, index) => (
                      <Picker.Item key={index} label={type} value={type} />
                    ))}
                  </Picker>
                </View>
              ) : (
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  style={{ padding:10, borderRadius:10, backgroundColor:"#F1F1F1", width:"100%", marginBottom:10 }}
                >
                  {activityTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              )}

              <Text style={styles.label}>Activity Date & Time:</Text>
              {Platform.OS !== 'web' ? (
                <>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text>{activityDate ? formatDateTime(activityDate) : "Select date & time"}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={activityDate ? new Date(activityDate) : new Date()}
                      mode="datetime"
                      minimumDate={new Date()}
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setActivityDate(selectedDate.toISOString());
                      }}
                    />
                  )}
                </>
              ) : (
                <input
                  type="datetime-local"
                  value={activityDate ? activityDate.substring(0,16) : ""}
                  min={new Date().toISOString().substring(0,16)}
                  onChange={(e) => setActivityDate(e.target.value)}
                  style={{ padding:10, borderRadius:10, backgroundColor:"#F1F1F1", width:"100%", marginBottom:10 }}
                />
              )}

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveActivity}>
                <Text style={styles.saveButtonText}>{editingActivity ? "Update" : "Save"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => { setModalVisible(false); setEditingActivity(null); setActivityDate(""); }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize:26, fontWeight:"bold", color:"#FF7043", marginBottom:20, textAlign:"center" },
  addButton: { backgroundColor:"#03A9F4", padding:12, borderRadius:10, marginBottom:15 },
  addButtonText: { color:"#FFF", fontSize:16, fontWeight:"bold", textAlign:"center" },
  activityRow: { flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginBottom:10, backgroundColor:"#9C27B0", borderRadius:12, padding:10 },
  buttonText: { color:"#FFF", fontSize:16, fontWeight:"bold" },
  dateText: { color:"#FFF", fontSize:12, marginTop:2 },
  editButton: { backgroundColor:"#FFA726", padding:6, borderRadius:10, marginLeft:5 },
  deleteButton: { backgroundColor:"#E53935", padding:6, borderRadius:10, marginLeft:5 },
  modalOverlay: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"rgba(0,0,0,0.5)" },
  modalContainer: { width:"90%", backgroundColor:"#FFF", borderRadius:15, padding:20 },
  modalTitle: { fontSize:20, fontWeight:"bold", color:"#FF7043", marginBottom:15, textAlign:"center" },
  input: { backgroundColor:"#F1F1F1", borderRadius:10, padding:10, marginBottom:10, fontSize:16 },
  pickerContainer: { backgroundColor:"#F1F1F1", borderRadius:10, marginBottom:10 },
  saveButton: { backgroundColor:"#03A9F4", padding:12, borderRadius:10, marginBottom:10 },
  saveButtonText: { color:"#FFF", fontSize:16, fontWeight:"bold", textAlign:"center" },
  cancelButton: { padding:12, borderRadius:10, backgroundColor:"#BDBDBD" },
  cancelButtonText: { color:"#FFF", fontSize:16, fontWeight:"bold", textAlign:"center" },
  backButton: { position:"absolute", top: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 50, left:20, flexDirection:"row", alignItems:"center", backgroundColor:"#FF7043", padding:10, borderRadius:10, zIndex:10 },
  backButtonText: { color:"#FFF", fontWeight:"bold", fontSize:16, marginLeft:5 },
  label: { fontWeight:"bold", marginBottom:5, marginTop:10 }
});
