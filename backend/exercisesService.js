import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

// Fetch all exercises for a lesson
export const getExercisesByLesson = async (lessonId) => {
  try {
    const snapshot = await getDocs(collection(db, `exercises/${lessonId}/questions`));
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
};
