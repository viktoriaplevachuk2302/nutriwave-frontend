import { useNavigate } from "react-router-dom";
import { logout } from "../services/firebase";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Помилка виходу:", error);
      alert("Помилка виходу. Спробуйте ще раз.");
    }
  };

  return (
    <nav className="navbar" style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      background: "#f8f8f5",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      borderBottom: "1px solid #C8D094",
    }}>
      {/* Логотип / назва */}
      <h1 
        style={{
          margin: 0,
          fontSize: "1.8rem",
          fontWeight: "bold",
          color: "#5B7133",
          cursor: "pointer",
          transition: "color 0.3s",
        }}
        onClick={() => navigate("/")}
        onMouseEnter={(e) => e.target.style.color = "#7A8D4A"}
        onMouseLeave={(e) => e.target.style.color = "#5B7133"}
      >
        NutriWave
      </h1>

      {/* Кнопки навігації */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap",
      }}>
        <button className="btn btn-outline" onClick={() => navigate("/")}>
          Головна
        </button>
        <button className="btn btn-outline" onClick={() => navigate("/diary")}>
          Щоденник
        </button>
        <button className="btn btn-outline" onClick={() => navigate("/progress")}>
          Прогрес
        </button>
        <button className="btn btn-outline" onClick={() => navigate("/programs")}>
          Програми
        </button>
        <button className="btn btn-outline" onClick={() => navigate("/recipes")}>
          Рецепти
        </button>
        <button className="btn btn-outline" onClick={() => navigate("/profile")}>
          Профіль
        </button>
        <button 
          className="btn btn-danger" 
          onClick={handleLogout}
          style={{
            background: "#d32f2f",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
          onMouseEnter={(e) => e.target.style.background = "#b71c1c"}
          onMouseLeave={(e) => e.target.style.background = "#d32f2f"}
        >
          Вихід
        </button>
      </div>
    </nav>
  );
};

export default Navbar;