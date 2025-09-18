import { db } from "./firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

/**
 * Add points to a student
 */
export async function addPoints(studentId, lessonId, points) {
  const studentRef = doc(db, "students", studentId);
  const studentSnap = await getDoc(studentRef);

  if (!studentSnap.exists()) {
    // Create new student document
    await setDoc(studentRef, { points: points, badges: [], lessonsCompleted: [lessonId] });
    return;
  }

  const data = studentSnap.data();
  const newPoints = (data.points || 0) + points;
  const lessonsCompleted = data.lessonsCompleted || [];
  if (!lessonsCompleted.includes(lessonId)) lessonsCompleted.push(lessonId);

  await updateDoc(studentRef, {
    points: newPoints,
    lessonsCompleted: lessonsCompleted,
  });

  await checkAndAwardBadges(studentId, newPoints, lessonsCompleted.length);
}

/**
 * Check badge criteria and award badges
 */
export async function checkAndAwardBadges(studentId, totalPoints, lessonsCompleted) {
  const studentRef = doc(db, "students", studentId);
  const studentSnap = await getDoc(studentRef);
  const data = studentSnap.data();
  const currentBadges = data.badges || [];

  const badgesToAward = [];

  // Example badge criteria
  if (totalPoints >= 100 && !currentBadges.includes("100PointsBadge")) badgesToAward.push("100PointsBadge");
  if (lessonsCompleted >= 5 && !currentBadges.includes("5LessonsBadge")) badgesToAward.push("5LessonsBadge");
  if (lessonsCompleted >= 10 && !currentBadges.includes("10LessonsBadge")) badgesToAward.push("10LessonsBadge");

  if (badgesToAward.length > 0) {
    await updateDoc(studentRef, {
      badges: arrayUnion(...badgesToAward),
    });
  }
}

/**
 * Get student points & badges
 */
export async function getStudentRewards(studentId) {
  const studentRef = doc(db, "students", studentId);
  const studentSnap = await getDoc(studentRef);
  if (!studentSnap.exists()) return { points: 0, badges: [] };
  return studentSnap.data();
}
