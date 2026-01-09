import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./services/firebase";
import { doc, getDoc, setDoc, onSnapshot, arrayUnion, increment } from "firebase/firestore";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Diary from "./pages/Diary";
import Progress from "./pages/Progress";
import Recipes from "./pages/Recipes";
import Profile from "./pages/Profile";
import Programs from "./pages/Programs";
import ProgramDetail from "./pages/ProgramDetail";
import Navbar from "./components/Navbar";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f8f5",
        fontSize: "1.5rem",
        color: "#5B7133",
      }}>
        Завантаження...
      </div>
    );
  }

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        {!user && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}

        {user && (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/diary" element={<Diary />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:id" element={<ProgramDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;