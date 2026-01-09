import { useState } from "react";
import { signInWithGoogle, registerWithEmail, loginWithEmail } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";

const Login = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      setError("Помилка входу через Google: " + err.message);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegister && password !== confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    if (email === "" || password === "") {
      setError("Заповніть всі поля");
      return;
    }

    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      navigate("/");
    } catch (err) {
      let message = err.message;
      if (message.includes("wrong-password")) message = "Невірний пароль";
      if (message.includes("user-not-found")) message = "Користувача не знайдено";
      if (message.includes("email-already-in-use")) message = "Email вже використовується";
      setError("Помилка: " + message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #5B7133, #C8D094)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="card" style={{ width: "420px", maxWidth: "90%" }}>
        <h1 style={{ textAlign: "center", color: "#5B7133", marginBottom: "0.5rem" }}>
          NutriWave
        </h1>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "2rem" }}>
          Платформа здорового способу життя
        </p>

        <button onClick={handleGoogle} className="btn btn-primary" style={{ width: "100%", marginBottom: "1.5rem" }}>
          Увійти через Google
        </button>

        <div style={{ textAlign: "center", margin: "1rem 0", color: "#666" }}>
          або
        </div>

        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              border: "1px solid #C8D094",
            }}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              border: "1px solid #C8D094",
            }}
          />
          {isRegister && (
            <input
              type="password"
              placeholder="Підтвердіть пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1rem",
                borderRadius: "8px",
                border: "1px solid #C8D094",
              }}
            />
          )}

          {error && <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>{error}</p>}

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            {isRegister ? "Зареєструватися" : "Увійти"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#666" }}>
          {isRegister ? "Вже є акаунт?" : "Новий користувач?"}{" "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#5B7133",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            {isRegister ? "Увійти" : "Зареєструватися"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;