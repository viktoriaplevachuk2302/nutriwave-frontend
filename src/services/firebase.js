import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";

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
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Вхід через Google
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

// Реєстрація email + пароль
export const registerWithEmail = (email, password) => 
  createUserWithEmailAndPassword(auth, email, password);

// Вхід email + пароль
export const loginWithEmail = (email, password) => 
  signInWithEmailAndPassword(auth, email, password);

// Вихід
export const logout = () => signOut(auth);