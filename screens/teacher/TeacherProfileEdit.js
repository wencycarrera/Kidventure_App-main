// frontend/screens/teacher/TeacherProfileEdit.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { auth, db } from "../../backend/firebaseConfig";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { updateEmail } from "firebase/auth";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

export default function TeacherProfileEdit({ navigation }) {
  const [teacher, setTeacher] = useState(null); // stores teacher data + docId
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 70 }, (_, i) => (2025 - i).toString());

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const teachersRef = collection(db, "teachers");
        const q = query(teachersRef, where("email", "==", auth.currentUser.email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data();
          const docId = snapshot.docs[0].id; // store docId for update
          setTeacher({ ...docData, docId });

          setFullName(docData.fullName || "");
          setEmail(docData.email || "");
          setAge(docData.age || "");
          setGender(docData.gender || "");

          if (docData.birthday) {
            const [year, month, day] = docData.birthday.split("-");
            setBirthYear(year);
            setBirthMonth(month);
            setBirthDay(day);
          }
        } else {
          Alert.alert("Error", "Teacher profile not found!");
        }
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Failed to fetch teacher profile");
      }
    };

    fetchTeacher();
  }, []);

  const handleUpdate = async () => {
    if (!fullName || !email || !age || !gender || !birthDay || !birthMonth || !birthYear) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const docRef = doc(db, "teachers", teacher.docId); // use docId for update
      await updateDoc(docRef, {
        fullName,
        email,
        age,
        gender,
        birthday: `${birthYear.padStart(4, "0")}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`,
      });

      if (auth.currentUser.email !== email) {
        await updateEmail(auth.currentUser, email);
      }

      Alert.alert("Success", "Profile updated successfully!");
      navigation.navigate("TeacherDashboard"); // Navigate to TeacherProfile
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to update profile. You may need to re-login to change email.");
    }
  };

  if (!teacher) return <Text style={{ flex: 1, textAlign: "center", marginTop: 50 }}>Loading...</Text>;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FFFDE7" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#FFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Edit Profile</Text>

        <TextInput placeholder="Full Name" style={styles.input} value={fullName} onChangeText={setFullName} />
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput placeholder="Age" style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />

        <View style={styles.pickerContainer}>
          <Picker selectedValue={gender} onValueChange={setGender}>
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <Text style={styles.label}>Birthday</Text>
        <View style={styles.birthdayRow}>
          <View style={styles.pickerContainerSmall}>
            <Picker selectedValue={birthDay} onValueChange={setBirthDay}>
              <Picker.Item label="Day" value="" />
              {days.map(d => <Picker.Item key={d} label={d} value={d} />)}
            </Picker>
          </View>
          <View style={styles.pickerContainerSmall}>
            <Picker selectedValue={birthMonth} onValueChange={setBirthMonth}>
              <Picker.Item label="Month" value="" />
              {months.map(m => <Picker.Item key={m} label={m} value={m} />)}
            </Picker>
          </View>
          <View style={styles.pickerContainerSmall}>
            <Picker selectedValue={birthYear} onValueChange={setBirthYear}>
              <Picker.Item label="Year" value="" />
              {years.map(y => <Picker.Item key={y} label={y} value={y} />)}
            </Picker>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  backButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#FF7043", padding: 10, borderRadius: 10, alignSelf: "flex-start", marginBottom: 15 },
  backText: { color: "#FFF", fontWeight: "bold", marginLeft: 5 },
  title: { fontSize: 26, fontWeight: "bold", color: "#FF7043", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#CCC", borderRadius: 10, padding: 15, marginVertical: 8, width: "100%", backgroundColor: "#FFF" },
  pickerContainer: { borderWidth: 1, borderColor: "#CCC", borderRadius: 10, width: "100%", marginVertical: 8, backgroundColor: "#FFF" },
  pickerContainerSmall: { flex: 1, borderWidth: 1, borderColor: "#CCC", borderRadius: 10, marginHorizontal: 4, backgroundColor: "#FFF" },
  birthdayRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginVertical: 8 },
  label: { alignSelf: "flex-start", marginTop: 10, marginBottom: 5, fontWeight: "bold" },
  button: { backgroundColor: "#FF7043", padding: 15, borderRadius: 20, alignItems: "center", marginTop: 20, width: "100%" },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});
