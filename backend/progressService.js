import { db } from "./firebaseConfig";
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";

// Save progress for a student
export const saveProgress = async (studentId, lessonId, score) => {
  try {
    await setDoc(doc(db, "progress", `${studentId}_${lessonId}`), {
      studentId,
      lessonId,
      score,
      completedAt: new Date(),
    });
  } catch (error) {
    console.error("Error saving progress:", error);
  }
};

// Get progress for a student
export const getStudentProgress = async (studentId) => {
  try {
    const q = query(collection(db, "progress"), where("studentId", "==", studentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error fetching progress:", error);
    return [];
  }
};
