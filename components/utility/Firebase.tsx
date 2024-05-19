import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCketmf2OtHQt1grAh4HjJTiDnkRS17-3o",
  authDomain: "take-home-assessment-fb57d.firebaseapp.com",
  projectId: "take-home-assessment-fb57d",
  storageBucket: "take-home-assessment-fb57d.appspot.com",
  messagingSenderId: "900350794774",
  appId: "1:900350794774:web:ace5fe3c02eaa09e86e937",
  measurementId: "G-EXKMLBXDYP"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);