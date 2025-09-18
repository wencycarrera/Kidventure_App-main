// frontend/screens/student/StudentProfileEdit.js
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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

export default function StudentProfileEdit({ navigation }) {
  const [student, setStudent] = useState(null);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [parentName, setParentName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [gradeSection, setGradeSection] = useState("");

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const currentYear = new Date().getFullYear();
  const allowedYears = [currentYear - 6, currentYear - 7].map(String);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const docRef = doc(db, "students", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setStudent(data);
          setFullName(data.fullName || "");
          setAge(data.age || "");
          setGender(data.gender || "");
          setAddress(data.address || "");
          setGradeSection(data.gradeSection || "");
          setParentName(data.parentName || "");
          setPhoneNumber(data.phoneNumber || "");

          if (data.birthday) {
            const [year, month, day] = data.birthday.split("-");
            setBirthYear(year);
            setBirthMonth(month);
            setBirthDay(day);
          }
        } else {
          Alert.alert("Error", "Student profile not found!");
        }
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Failed to fetch student profile");
      }
    };

    fetchStudent();
  }, []);

  const handleUpdate = async () => {
    if (!fullName || !age || !gender || !birthDay || !birthMonth || !birthYear || !parentName || !phoneNumber || !address || !gradeSection) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const docRef = doc(db, "students", auth.currentUser.uid);
      await updateDoc(docRef, {
        fullName,
        age,
        gender,
        birthday: `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`,
        parentName,
        phoneNumber,
        address,
        gradeSection,
      });

      Alert.alert("Success", "Profile updated successfully!");
      // Navigate to Student Profile screen
      navigation.navigate("StudentProfile"); // <-- use your actual route name
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to update profile");
    }
  };


  if (!student) return <Text style={{ flex: 1, textAlign: "center", marginTop: 50 }}>Loading...</Text>;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FFFDE7" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FF7043" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Edit Profile</Text>

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

        {/* Age */}
        <Text style={styles.label}>Age</Text>
        <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />

        {/* Gender */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)}>
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        {/* Birthday */}
        <Text style={styles.label}>Birthday</Text>
        <View style={styles.birthdayRow}>
          <View style={styles.pickerContainerSmall}>
            <Picker selectedValue={birthDay} onValueChange={setBirthDay}>
              <Picker.Item label="Day" value="" />
              {days.map((d) => <Picker.Item key={d} label={d} value={d} />)}
            </Picker>
          </View>
          <View style={styles.pickerContainerSmall}>
            <Picker selectedValue={birthMonth} onValueChange={setBirthMonth}>
              <Picker.Item label="Month" value="" />
              {months.map((m) => <Picker.Item key={m} label={m} value={m} />)}
            </Picker>
          </View>
          <View style={styles.pickerContainerSmall}>
            <Picker selectedValue={birthYear} onValueChange={setBirthYear}>
              <Picker.Item label="Year" value="" />
              {allowedYears.map((y) => <Picker.Item key={y} label={y} value={y} />)}
            </Picker>
          </View>
        </View>

        {/* Parent Name */}
        <Text style={styles.label}>Parent / Guardian Name</Text>
        <TextInput style={styles.input} value={parentName} onChangeText={setParentName} />

        {/* Phone Number */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />

        {/* Grade & Section */}
        <Text style={styles.label}>Grade & Section</Text>
        <TextInput style={styles.input} value={gradeSection} onChangeText={setGradeSection} />

        {/* Address */}
        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} />

        {/* Update Button */}
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  backButton: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", marginBottom: 10 },
  backText: { marginLeft: 5, color: "#FF7043", fontSize: 16, fontWeight: "bold" },
  title: { fontSize: 26, fontWeight: "bold", color: "#4CAF50", marginBottom: 20, textAlign: "center" },
  label: { alignSelf: "flex-start", marginTop: 10, marginBottom: 5, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#CCC", borderRadius: 10, padding: 15, marginVertical: 8, width: "100%", backgroundColor: "#FFF" },
  pickerContainer: { borderWidth: 1, borderColor: "#CCC", borderRadius: 10, width: "100%", marginVertical: 8, backgroundColor: "#FFF" },
  pickerContainerSmall: { flex: 1, borderWidth: 1, borderColor: "#CCC", borderRadius: 10, marginHorizontal: 4, backgroundColor: "#FFF" },
  birthdayRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginVertical: 8 },
  button: { backgroundColor: "#FFA726", padding: 15, borderRadius: 20, alignItems: "center", marginTop: 20, width: "100%" },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});
