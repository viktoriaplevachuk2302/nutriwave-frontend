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
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.8rem 2rem",
      background: "#5B7133", // зелений фон як на фото
      color: "white",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
    }}>
      {/* Логотип / назва */}
      <h1 
        style={{
          margin: 0,
          fontSize: "1.8rem",
          fontWeight: "bold",
          color: "white",
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
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
        <button 
          className="btn" 
          style={{
            background: "transparent",
            border: "2px solid white",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onClick={() => navigate("/")}
        >
          Головна
        </button>

        <button 
          className="btn" 
          style={{
            background: "transparent",
            border: "2px solid white",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onClick={() => navigate("/diary")}
        >
          Щоденник
        </button>

        <button 
          className="btn" 
          style={{
            background: "transparent",
            border: "2px solid white",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onClick={() => navigate("/progress")}
        >
          Прогрес
        </button>

        <button 
          className="btn" 
          style={{
            background: "transparent",
            border: "2px solid white",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onClick={() => navigate("/programs")}
        >
          Програми
        </button>

        <button 
          className="btn" 
          style={{
            background: "transparent",
            border: "2px solid white",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onClick={() => navigate("/recipes")}
        >
          Рецепти
        </button>

        <button 
          className="btn" 
          style={{
            background: "transparent",
            border: "2px solid white",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onClick={() => navigate("/profile")}
        >
          Профіль
        </button>

        <button 
          onClick={handleLogout}
          style={{
            background: "#d32f2f",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            fontWeight: "600",
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