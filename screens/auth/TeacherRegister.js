import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../backend/firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const showAlert = (title, message) => {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
  } else {
    alert(`${title}\n\n${message}`);
  }
};

export default function TeacherRegister({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const allowedYears = Array.from({ length: 40 }, (_, i) => (1985 + i).toString());

  // Auto-calculate age
  useEffect(() => {
    if (birthDay && birthMonth && birthYear) {
      const today = new Date();
      const birthDate = new Date(`${birthYear}-${birthMonth}-${birthDay}`);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - (parseInt(birthMonth) - 1);
      if (m < 0 || (m === 0 && today.getDate() < parseInt(birthDay))) calculatedAge--;
      setAge(calculatedAge.toString());
    }
  }, [birthDay, birthMonth, birthYear]);

  const validateFields = () => {
    let tempErrors = {};
    if (!fullName) tempErrors.fullName = "Please fill out this field";
    if (!birthDay || !birthMonth || !birthYear) tempErrors.birthday = "Please select birthday";
    if (!gender) tempErrors.gender = "Please select gender";
    if (!email) tempErrors.email = "Please fill out this field";
    if (!password) tempErrors.password = "Please fill out this field";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateFields()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const formattedBirthday = `${birthYear}-${("0"+birthMonth).slice(-2)}-${("0"+birthDay).slice(-2)}`;

      // Save to Firestore
      await setDoc(doc(db, "teachers", user.uid), {
        fullName,
        age,
        gender,
        birthday: formattedBirthday,
        email,
        role: "teacher",
        createdAt: new Date().toISOString(),
      });

      await sendEmailVerification(user);
      setVerificationModalVisible(true);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showAlert("Email Already Registered", "This email is already used. Please login or use another email.");
      } else {
        showAlert("Error", error.message);
      }
    }
  };

  const checkEmailVerification = async () => {
    const user = auth.currentUser;
    await user.reload();
    if (user.emailVerified) {
      setVerificationModalVisible(false);
      showAlert("Success", "Email verified successfully!");
      navigation.replace("TeacherDashboard");
    } else {
      showAlert("Not Verified", "Email not verified yet. Please check your inbox.");
    }
  };

  const renderInput = (label, value, setter, error, keyboardType = "default", secure = false, editable = true) => (
    <View style={{ width: "100%", marginBottom: 8 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={error ? error : `Enter ${label}`}
        placeholderTextColor={error ? "red" : "#999"}
        style={[styles.input, error && { borderColor: "red" }]}
        value={value}
        onChangeText={setter}
        keyboardType={keyboardType}
        secureTextEntry={secure}
        editable={editable}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#FF7043" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Teacher Registration</Text>

          {renderInput("Full Name", fullName, setFullName, errors.fullName)}

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
                {allowedYears.map(y => <Picker.Item key={y} label={y} value={y} />)}
              </Picker>
            </View>
          </View>

          {renderInput("Age", age, setAge, null, "numeric", false, false)}

          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={gender} onValueChange={setGender}>
              <Picker.Item label={errors.gender || "Select Gender"} value="" color={errors.gender ? "red" : "#000"} />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          {renderInput("Email", email, setEmail, errors.email, "email-address")}
          <View style={{ width: "100%", marginBottom: 8 }}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder={errors.password ? errors.password : "Enter Password"}
                placeholderTextColor={errors.password ? "red" : "#999"}
                style={[styles.inputPassword, errors.password && { borderColor: "red" }]}
                value={password}
                onChangeText={(text) => { setPassword(text); if (errors.password) setErrors(prev => ({...prev, password:""})); }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="#888" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>

        <Modal transparent visible={verificationModalVisible} animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.alertBox}>
              <Text style={styles.message}>
                Registration successful! Please verify your email to continue.
              </Text>
              <TouchableOpacity style={styles.button} onPress={checkEmailVerification}>
                <Text style={styles.buttonText}>Check Verification</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#FFFDE7" },
  container: { width: "100%", alignItems: "center" },
  backButton: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", marginBottom: 10 },
  backText: { marginLeft: 5, color: "#FF7043", fontSize: 16, fontWeight: "bold" },
  title: { fontSize: 28, fontWeight: "bold", color: "#FF7043", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#CCC", borderRadius: 10, padding: 15, backgroundColor: "#FFF", width: "100%" },
  pickerContainer: { borderWidth: 1, borderColor: "#CCC", borderRadius: 15, width: "100%", marginVertical: 8, backgroundColor: "#FFF" },
  pickerContainerSmall: { flex: 1, borderWidth: 1, borderColor: "#CCC", borderRadius: 15, marginHorizontal: 4, backgroundColor: "#FFF", justifyContent: "center" },
  birthdayRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginVertical: 8 },
  passwordContainer: { flexDirection: "row", alignItems: "center", width: "100%", borderWidth: 1, borderColor: "#CCC", borderRadius: 15, paddingHorizontal: 10, backgroundColor: "#FFF" },
  inputPassword: { flex: 1, paddingVertical: 15 },
  button: { backgroundColor: "#FF7043", padding: 15, borderRadius: 20, alignItems: "center", marginTop: 20, width: "100%" },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  label: { alignSelf: "flex-start", marginBottom: 5, fontWeight: "bold" },
  overlay: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"rgba(0,0,0,0.5)" },
  alertBox: { width:"80%", padding:20, backgroundColor:"#fff", borderRadius:15, alignItems:"center" },
  message: { fontSize:16, marginBottom:20, textAlign:"center" },
});
