import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, arrayUnion, increment } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhjyHQwNDgXOIyvPS5Yr4_PCDMt4JBuUQ",
  authDomain: "nutriwave-60a92.firebaseapp.com",
  projectId: "nutriwave-60a92",
  storageBucket: "nutriwave-60a92.appspot.com",
  messagingSenderId: "540400505022",
  appId: "1:540400505022:web:685cd74d72fc20c3daceef",
  measurementId: "G-8MHJPHLHPX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Google Provider
const googleProvider = new GoogleAuthProvider();

// Функції авторизації
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google sign in error:", error);
    throw error;
  }
};

const registerWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Email registration error:", error);
    throw error;
  }
};

const loginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Email login error:", error);
    throw error;
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    console.log("Користувач вийшов");
  } catch (error) {
    console.error("Помилка виходу:", error);
    throw error;
  }
};

export { 
  auth, 
  db, 
  signInWithGoogle, 
  registerWithEmail, 
  loginWithEmail, 
  logout,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  arrayUnion,
  increment
};