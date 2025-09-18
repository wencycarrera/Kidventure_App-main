import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { auth, db } from "../../backend/firebaseConfig";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function TeacherLogin({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const showAlert = (title, message) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
    } else {
      alert(`${title}\n\n${message}`);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.goBack();
      return true;
    });

    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await user.reload();

          if (!user.emailVerified) {
            setLoading(false);
            return;
          }

          const teacherRef = doc(db, "teachers", user.uid);
          const teacherDoc = await getDoc(teacherRef);

          if (!teacherDoc.exists()) {
            await signOut(auth);
            setLoading(false);
            return; // No alert for auto-login
          }

          // Real-time deletion listener
          unsubscribeSnapshot = onSnapshot(teacherRef, (docSnapshot) => {
            if (!docSnapshot.exists()) {
              signOut(auth);
            }
          });

          navigation.replace("TeacherDashboard", { teacherId: user.uid });
          return;
        } catch (error) {
          console.error("Auto-login error:", error);
        }
      }
      setLoading(false);
    });

    return () => {
      backHandler.remove();
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, [navigation]);

  const handleLogin = async () => {
    let hasError = false;

    if (!email.trim()) {
      setEmailError(true);
      hasError = true;
    } else setEmailError(false);

    if (!password.trim()) {
      setPasswordError(true);
      hasError = true;
    } else setPasswordError(false);

    if (hasError) return;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await user.reload();

      if (!user.emailVerified) {
        showAlert("Email not verified", "Please verify your email before logging in.");
        return;
      }

      const teacherRef = doc(db, "teachers", user.uid);
      const teacherDoc = await getDoc(teacherRef);

      if (!teacherDoc.exists()) {
        await signOut(auth);
        showAlert(
          "Account Missing",
          "This account has no teacher record. It may have been deleted."
        );
        return;
      }

      // Real-time deletion listener
      onSnapshot(teacherRef, (docSnapshot) => {
        if (!docSnapshot.exists()) {
          signOut(auth);
          showAlert(
            "Account Deleted",
            "Your teacher record has been deleted. You have been logged out."
          );
        }
      });

      navigation.replace("TeacherDashboard", { teacherId: user.uid });
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        showAlert("Account Deleted", "This email is not registered. It may have been deleted.");
      } else if (error.code === "auth/wrong-password") {
        showAlert("Error", "Incorrect password. Try again.");
      } else {
        showAlert("Error", error.message);
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setEmailError(true);
      showAlert("Error", "Please enter your email to reset password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("Error", "Please enter a valid email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showAlert("Success", "Password reset email sent! Check your inbox.");
      setEmailError(false);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        showAlert("Error", "No account found with this email.");
      } else {
        showAlert("Error", error.message);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7043" />
        <Text>Checking login session...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FF7043" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Teacher Login</Text>

        <TextInput
          placeholder={emailError ? "Please fill in email" : "Email"}
          style={[styles.input, emailError && { borderColor: "red" }]}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError(false);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={[styles.passwordContainer, passwordError && { borderColor: "red" }]}>
          <TextInput
            placeholder={passwordError ? "Please fill in password" : "Password"}
            style={styles.inputPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(false);
            }}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.bottomRow}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.bottomText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Text style={{ marginHorizontal: 10, fontWeight: "bold", color: "#000" }}>|</Text>

          <TouchableOpacity onPress={() => navigation.navigate("TeacherRegister")}>
            <Text style={styles.bottomText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#FFFDE7", alignItems: "center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFDE7" },
  backButton: { position: "absolute", top: 50, left: 20, flexDirection: "row", alignItems: "center" },
  backText: { marginLeft: 5, color: "#FF7043", fontSize: 16, fontWeight: "bold" },
  title: { fontSize: 28, fontWeight: "bold", color: "#FF7043", textAlign: "center", marginBottom: 30 },
  input: { borderWidth: 1, borderColor: "#CCC", borderRadius: 15, padding: 15, marginVertical: 8, backgroundColor: "#FFF", width: "100%" },
  passwordContainer: { flexDirection: "row", alignItems: "center", width: "100%", borderWidth: 1, borderColor: "#CCC", borderRadius: 15, paddingHorizontal: 10, backgroundColor: "#FFF", marginVertical: 8 },
  inputPassword: { flex: 1, paddingVertical: 15, paddingHorizontal: 10, color: "#000" },
  button: { backgroundColor: "#FF7043", padding: 15, borderRadius: 25, alignItems: "center", marginTop: 20, width: "100%" },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 20, alignItems: "center" },
  bottomText: { color: "#0288D1", fontWeight: "bold" },
});
