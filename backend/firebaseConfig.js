// backend/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA3LqpD1Qy73M9W7jdifbKUufxF6mzYRd8",
  authDomain: "kidventure-app-6c02a.firebaseapp.com",
  projectId: "kidventure-app-6c02a",
  storageBucket: "kidventure-app-6c02a.appspot.com",
  messagingSenderId: "1097104387143",
  appId: "1:1097104387143:web:xxxxxxxxxxxxxxxxxx",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
