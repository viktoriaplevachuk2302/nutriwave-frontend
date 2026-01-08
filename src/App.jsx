import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./services/firebase";
import axios from "axios";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Diary from "./pages/Diary";
import Progress from "./pages/Progress";
import Recipes from "./pages/Recipes";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Programs from "./pages/Programs";
import ProgramDetail from "./pages/ProgramDetail";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          const res = await axios.get("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setHasProfile(!!res.data.age);
        } catch (err) {
          setHasProfile(false);
        }
      } else {
        setHasProfile(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8f5" }}>
        Завантаження...
      </div>
    );
  }

  // Якщо користувач не залогінений — тільки логін
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  // Якщо залогінений — навбар скрізь + роути
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Якщо профіль не заповнений — тільки профіль */}
        {!hasProfile && <Route path="*" element={<Profile />} />}

        {/* Якщо профіль заповнений — всі сторінки */}
        {hasProfile && (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/diary" element={<Diary />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/programs" element={user ? <Programs /> : <Navigate to="/login" />} />
<Route path="/programs/:id" element={user ? <ProgramDetail /> : <Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;