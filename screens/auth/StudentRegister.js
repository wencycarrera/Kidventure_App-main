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
  Modal,
  Alert
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../backend/firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export default function StudentRegister({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [gradeSection, setGradeSection] = useState("");
  const [parentName, setParentName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const currentYear = new Date().getFullYear();
  const allowedYears = [currentYear - 6, currentYear - 7].map(String);

  /// Auto-calculate age safely for web & mobile
useEffect(() => {
  // Get month index from selected month name
  const monthIndex = months.indexOf(birthMonth); // 0 for Jan, 1 for Feb, etc.
  const dayNum = parseInt(birthDay, 10);
  const yearNum = parseInt(birthYear, 10);

  // Only calculate if all fields are valid
  if (!isNaN(dayNum) && !isNaN(yearNum) && monthIndex >= 0) {
    const today = new Date();
    const birthDate = new Date(yearNum, monthIndex, dayNum);

    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    setAge(calculatedAge.toString());
  } else {
    setAge(""); // Clear age if inputs are invalid
  }
}, [birthDay, birthMonth, birthYear]);

  const validateFields = () => {
    let tempErrors = {};
    if (!fullName) tempErrors.fullName = "Please fill out this field";
    if (!birthDay || !birthMonth || !birthYear) tempErrors.birthday = "Please fill out this field";
    if (!gender) tempErrors.gender = "Please select gender";
    if (!gradeSection) tempErrors.gradeSection = "Please fill out this field";
    if (!parentName) tempErrors.parentName = "Please fill out this field";
    if (!phoneNumber) tempErrors.phoneNumber = "Please fill out this field";
    else if (!/^\d{11}$/.test(phoneNumber)) tempErrors.phoneNumber = "Phone number must be 11 digits";
    if (!address) tempErrors.address = "Please fill out this field";
    if (!email) tempErrors.email = "Please fill out this field";
    if (!password) tempErrors.password = "Please fill out this field";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateFields()) return;
    if (parseInt(age) < 6 || parseInt(age) > 7) {
      Alert.alert("Error", "Age must be 6 or 7");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save student data in Firestore
      await setDoc(doc(db, "students", user.uid), {
        fullName,
        age,
        gender,
        birthday: `${birthYear}-${birthMonth.padStart(2,"0")}-${birthDay.padStart(2,"0")}`,
        gradeSection,
        parentName,
        phoneNumber,
        address,
        email,
        enrollmentDate: new Date().toISOString().split("T")[0],
      });

      // Send email verification
      await sendEmailVerification(user);
      setVerificationModalVisible(true);

    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Email Already Registered", "This email is already used. Please login or use another email.");
      } else {
        Alert.alert("Error", error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkEmailVerification = async () => {
    const user = auth.currentUser;
    await user.reload();
    if (user.emailVerified) {
      setVerificationModalVisible(false);
      Alert.alert("Success", "Email verified successfully!");
      navigation.replace("StudentDashboard");
    } else {
      Alert.alert("Not Verified", "Email not verified yet. Please check your inbox.");
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
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#FF7043" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Student Registration</Text>

          {renderInput("Full Name", fullName, setFullName, errors.fullName)}

          {/* Birthday Pickers */}
          <Text style={styles.label}>Birthday</Text>
          <View style={styles.birthdayRow}>
            <View style={styles.pickerContainerMonth}>
              <Picker selectedValue={birthMonth} onValueChange={setBirthMonth} style={styles.picker}>
                <Picker.Item label="Month" value="" />
                {months.map((m, i) => <Picker.Item key={i} label={m} value={m} />)}
              </Picker>
            </View>
            <View style={styles.pickerContainerSmall}>
              <Picker selectedValue={birthDay} onValueChange={setBirthDay} style={styles.picker}>
                <Picker.Item label="Day" value="" />
                {days.map(d => <Picker.Item key={d} label={d} value={d} />)}
              </Picker>
            </View>
            <View style={styles.pickerContainerSmall}>
              <Picker selectedValue={birthYear} onValueChange={setBirthYear} style={styles.picker}>
                <Picker.Item label="Year" value="" />
                {allowedYears.map(y => <Picker.Item key={y} label={y} value={y} />)}
              </Picker>
            </View>
          </View>

          {renderInput("Age", age, setAge, errors.age, "numeric", false, false)}

          {/* Gender Picker */}
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={gender} onValueChange={setGender} style={styles.picker}>
              <Picker.Item label={errors.gender || "Select Gender"} value="" color={errors.gender ? "red" : "#000"} />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          {renderInput("Grade & Section", gradeSection, setGradeSection, errors.gradeSection)}
          {renderInput("Parent / Guardian Name", parentName, setParentName, errors.parentName)}
          {renderInput("Phone Number", phoneNumber, setPhoneNumber, errors.phoneNumber, "phone-pad")}
          {renderInput("Address", address, setAddress, errors.address)}
          {renderInput("Email", email, setEmail, errors.email, "email-address")}

          {/* Password */}
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

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.button, isSubmitting && { opacity: 0.6 }]}
            onPress={handleRegister}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>{isSubmitting ? "Registering..." : "Register"}</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity onPress={() => navigation.navigate("StudentLogin")} style={{ marginTop: 20 }}>
            <Text style={styles.loginText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>

        {/* Verification Modal */}
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
  pickerContainerMonth: { flex: 2, borderWidth: 1, borderColor: "#CCC", borderRadius: 15, marginRight: 4, backgroundColor: "#FFF", justifyContent: "center" },
  pickerContainerSmall: { flex: 1, borderWidth: 1, borderColor: "#CCC", borderRadius: 15, marginHorizontal: 4, backgroundColor: "#FFF", justifyContent: "center" },
  birthdayRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginVertical: 8 },
  picker: { flex: 1, height: 60 },
  passwordContainer: { flexDirection: "row", alignItems: "center", width: "100%", borderWidth: 1, borderColor: "#CCC", borderRadius: 15, paddingHorizontal: 10, backgroundColor: "#FFF" },
  inputPassword: { flex: 1, paddingVertical: 15 },
  button: { backgroundColor: "#FF7043", padding: 15, borderRadius: 20, alignItems: "center", marginTop: 20, width: "100%" },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  label: { alignSelf: "flex-start", marginBottom: 5, fontWeight: "bold" },
  loginText: { color: "#FF7043", fontWeight: "bold", textDecorationLine: "underline" },
  overlay: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"rgba(0,0,0,0.5)" },
  alertBox: { width:"80%", padding:20, backgroundColor:"#fff", borderRadius:15, alignItems:"center" },
  message: { fontSize:16, marginBottom:20, textAlign:"center" },
});
