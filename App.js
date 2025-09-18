import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// ── App Screens ─────────────────────────────
import WelcomeScreen from "./screens/app/WelcomeScreen";
import AuthMenu from "./screens/app/AuthMenu";
import AuthAdmin from "./screens/app/AuthAdmin";

// ── Admin Auth ───────────────────────────
import AdminDashboard from "./screens/admin/AdminDashboard";
import StudentDetail from "./screens/admin/StudentDetail";
import TeacherDetail from "./screens/admin/TeacherDetail";

// ── Admin Management Screens ─────────────────
import ManageStudents from "./screens/admin/manage/ManageStudents";
import ManageTeachers from "./screens/admin/manage/ManageTeachers";
import ManageLessons from "./screens/admin/manage/ManageLessons";
import ManageActivities from "./screens/admin/manage/ManageActivities";
import ManageProgress from "./screens/admin/manage/ManageProgress";
import ManageRewards from "./screens/admin/manage/ManageRewards";

// ── Student Auth ───────────────────────────
import StudentAuth from "./screens/auth/StudentAuth";
import StudentLogin from "./screens/auth/StudentLogin";
import StudentRegister from "./screens/auth/StudentRegister";

// ── Student Screens ─────────────────────────
import StudentDashboard from "./screens/student/StudentDashboard";
import ProgressScreen from "./screens/student/ProgressScreen";
import StudentProfile from "./screens/student/StudentProfile";
import StudentProfileEdit from "./screens/student/StudentProfileEdit";
import StudentSettings from "./screens/student/StudentSettings";
import StudentActivitiesScreen from "./screens/student/StudentActivitiesScreen";
import ActivityDetailScreen from "./screens/student/ActivityDetailScreen";
import StudentListScreen from "./screens/student/StudentListScreen";

// ── Student Lessons Q1 ─────────────────────
import LessonsQ1 from "./screens/lessons/LessonsQ1";

import CountingLesson from "./screens/lessons/Q1_NumbersNumberSense/CountingLesson";
import OrderingComparingLesson from "./screens/lessons/Q1_NumbersNumberSense/OrderingComparingLesson";
import OrdinalLesson from "./screens/lessons/Q1_NumbersNumberSense/OrdinalLesson";
import PlaceValueLesson from "./screens/lessons/Q1_NumbersNumberSense/PlaceValueLesson";
import SkipCountingLesson from "./screens/lessons/Q1_NumbersNumberSense/SkipCountingLesson";
import MoneyRecognitionLesson from "./screens/lessons/Q1_NumbersNumberSense/MoneyRecognitionLesson";

// ── Student Exercises Q1 ────────────────────
import ExerciseQ1 from "./screens/exercises/ExerciseQ1";
import CountingExercise from "./screens/exercises/Q1_NumbersNumberSense/CountingExercise";
import OrderingExercise from "./screens/exercises/Q1_NumbersNumberSense/OrderingExercise";
import OrdinalExercise from "./screens/exercises/Q1_NumbersNumberSense/OrdinalExercise";
import PlaceValueExercise from "./screens/exercises/Q1_NumbersNumberSense/PlaceValueExercise";
import SkipCountingExercise from "./screens/exercises/Q1_NumbersNumberSense/SkipCountingExercise";
import MoneyExerciseQ1 from "./screens/exercises/Q1_NumbersNumberSense/MoneyExerciseQ1";

// ── Student Lessons Q2 ─────────────────────
import AdditionLesson from "./screens/lessons/Q2_AdditionSubtraction/AdditionLesson";
import SubtractionLesson from "./screens/lessons/Q2_AdditionSubtraction/SubtractionLesson";
import InverseOperationsLesson from "./screens/lessons/Q2_AdditionSubtraction/InverseOperationsLesson";
import MoneyLessonQ2 from "./screens/lessons/Q2_AdditionSubtraction/MoneyLessonQ2";
import WordProblemLesson from "./screens/lessons/Q2_AdditionSubtraction/WordProblemLesson";

// ── Student Exercises Q2 ────────────────────
import AdditionExercise from "./screens/exercises/Q2_AdditionSubtraction/AdditionExercise";
import SubtractionExercise from "./screens/exercises/Q2_AdditionSubtraction/SubtractionExercise";
import InverseOperationsExercise from "./screens/exercises/Q2_AdditionSubtraction/InverseOperationsExercise";
import MoneyExerciseQ2 from "./screens/exercises/Q2_AdditionSubtraction/MoneyExerciseQ2";
import WordProblemExercise from "./screens/exercises/Q2_AdditionSubtraction/WordProblemExercise";

// ── Teacher Screens ─────────────────────────
import TeacherAuth from "./screens/auth/TeacherAuth";
import TeacherLogin from "./screens/auth/TeacherLogin";
import TeacherRegister from "./screens/auth/TeacherRegister";
import TeacherDashboard from "./screens/teacher/TeacherDashboard";
import TeacherProfile from "./screens/teacher/TeacherProfile";
import TeacherProfileEdit from "./screens/teacher/TeacherProfileEdit";
import TeacherSettings from "./screens/teacher/TeacherSettings";
import TeacherActivities from './screens/teacher/TeacherActivities';
import TeacherMaterials from './screens/teacher/TeacherMaterials';
import TeacherStudentProgress from "./screens/teacher/TeacherStudentProgress";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen" screenOptions={{ headerShown: false }}>

        {/* ── App ── */}
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="AuthMenu" component={AuthMenu} />
        <Stack.Screen name="AuthAdmin" component={AuthAdmin} />

        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="StudentDetail" component={StudentDetail} />
        <Stack.Screen name="TeacherDetail" component={TeacherDetail} />

        {/* ── Admin Management Screens ── */}
        <Stack.Screen name="ManageStudents" component={ManageStudents} />
        <Stack.Screen name="ManageTeachers" component={ManageTeachers} />
        <Stack.Screen name="ManageLessons" component={ManageLessons} />
        <Stack.Screen name="ManageActivities" component={ManageActivities} />
        <Stack.Screen name="ManageProgress" component={ManageProgress} />
        <Stack.Screen name="ManageRewards" component={ManageRewards} />

        
        {/* ── Student ── */}
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        <Stack.Screen name="ProgressScreen" component={ProgressScreen} />
        <Stack.Screen name="StudentProfile" component={StudentProfile} />
        <Stack.Screen name="StudentSettings" component={StudentSettings} />
         <Stack.Screen name="StudentProfileEdit" component={StudentProfileEdit} />
        <Stack.Screen name="StudentActivitiesScreen" component={StudentActivitiesScreen} />
        <Stack.Screen name="ActivityDetailScreen" component={ActivityDetailScreen} />
         <Stack.Screen name="StudentListScreen" component={StudentListScreen} />
         
        <Stack.Screen name="LessonsQ1" component={LessonsQ1} />
        <Stack.Screen name="ExerciseQ1" component={ExerciseQ1} />

        {/* ── Student Auth ── */}
        <Stack.Screen name="StudentAuth" component={StudentAuth} />
        <Stack.Screen name="StudentLogin" component={StudentLogin} />
        <Stack.Screen name="StudentRegister" component={StudentRegister} />

        {/* ── Lessons Q1 ── */}
        <Stack.Screen name="CountingLesson" component={CountingLesson} />
        <Stack.Screen name="OrderingComparingLesson" component={OrderingComparingLesson} />
        <Stack.Screen name="OrdinalLesson" component={OrdinalLesson} />
        <Stack.Screen name="PlaceValueLesson" component={PlaceValueLesson} />
        <Stack.Screen name="SkipCountingLesson" component={SkipCountingLesson} />
        <Stack.Screen name="MoneyRecognitionLesson" component={MoneyRecognitionLesson} />

        {/* ── Lessons Q2 ── */}
        <Stack.Screen name="AdditionLesson" component={AdditionLesson} />
        <Stack.Screen name="SubtractionLesson" component={SubtractionLesson} />
        <Stack.Screen name="InverseOperationsLesson" component={InverseOperationsLesson} />
        <Stack.Screen name="MoneyLessonQ2" component={MoneyLessonQ2} />
        <Stack.Screen name="WordProblemLesson" component={WordProblemLesson} />

        {/* ── Exercises Q1 ── */}
        <Stack.Screen name="CountingExercise" component={CountingExercise} />
        <Stack.Screen name="OrderingExercise" component={OrderingExercise} />
        <Stack.Screen name="OrdinalExercise" component={OrdinalExercise} />
        <Stack.Screen name="PlaceValueExercise" component={PlaceValueExercise} />
        <Stack.Screen name="SkipCountingExercise" component={SkipCountingExercise} />
        <Stack.Screen name="MoneyExerciseQ1" component={MoneyExerciseQ1} />

        {/* ── Exercises Q2 ── */}
        <Stack.Screen name="AdditionExercise" component={AdditionExercise} />
        <Stack.Screen name="SubtractionExercise" component={SubtractionExercise} />
        <Stack.Screen name="InverseOperationsExercise" component={InverseOperationsExercise} />
        <Stack.Screen name="MoneyExerciseQ2" component={MoneyExerciseQ2} />
        <Stack.Screen name="WordProblemExercise" component={WordProblemExercise} />

        {/* ── Teacher ── */}
        <Stack.Screen name="TeacherAuth" component={TeacherAuth} />
        <Stack.Screen name="TeacherLogin" component={TeacherLogin} />
        <Stack.Screen name="TeacherRegister" component={TeacherRegister} />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
        <Stack.Screen name="TeacherProfile" component={TeacherProfile} />
        <Stack.Screen name="TeacherProfileEdit" component={TeacherProfileEdit} />
        <Stack.Screen name="TeacherSettings" component={TeacherSettings} />
        <Stack.Screen name="TeacherActivities" component={TeacherActivities} />
        <Stack.Screen name="TeacherMaterials" component={TeacherMaterials} />
        <Stack.Screen name="TeacherStudentProgress" component={TeacherStudentProgress} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}
