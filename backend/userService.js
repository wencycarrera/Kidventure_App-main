import { db } from "./firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Save user with role
export const createUserProfile = async (userId, role, name) => {
  try {
    await setDoc(doc(db, "users", userId), {
      name,
      role,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
  }
};

// Get user data
export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data();
    else return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};
