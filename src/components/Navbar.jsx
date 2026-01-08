import { useNavigate } from "react-router-dom";
import { logout } from "../services/firebase";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold" }}>NutriWave</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
        <button className="btn btn-outline" onClick={handleLogout}>
          Вихід
        </button>
      </div>
    </nav>
  );
};

export default Navbar;