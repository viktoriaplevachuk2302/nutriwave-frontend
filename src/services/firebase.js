import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

export { auth, db };