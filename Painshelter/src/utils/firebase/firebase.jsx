import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB3PbxX50Sjy6ResCZThq9x3hwRdUW8Fsk",
  authDomain: "painshelter.firebaseapp.com",
  projectId: "painshelter",
  storageBucket: "painshelter.appspot.com",
  messagingSenderId: "698261612830",
  appId: "1:698261612830:web:0f0c3d258c58c23d65c10f",
  measurementId: "G-GCF2382W03",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage();
export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};
export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
export default app;
