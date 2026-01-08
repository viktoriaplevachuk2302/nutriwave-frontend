import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../services/firebase";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState("");

  const categories = {
    all: "Всі",
    breakfast: "Сніданок",
    lunch: "Обід",
    dinner: "Вечеря",
    snack: "Перекус",
  };

  useEffect(() => {
    axios
      .get("https://nutriwave-backend.onrender.com/api/recipes")
      .then((res) => {
        setRecipes(res.data);
        setFilteredRecipes(res.data);
      })
      .catch((err) => console.error("Помилка завантаження рецептів"));
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredRecipes(recipes);
    } else {
      setFilteredRecipes(recipes.filter((r) => r.category === selectedCategory));
    }
  }, [selectedCategory, recipes]);

  const handleAddToDiary = async () => {
    if (!selectedRecipe || !selectedMealType) return;

    const data = {
      mealType: selectedMealType,
      foodName: selectedRecipe.title,
      calories: selectedRecipe.calories,
      protein: selectedRecipe.protein || 0,
      carbs: selectedRecipe.carbs || 0,
      fat: selectedRecipe.fat || 0,
    };

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post("https://nutriwave-backend.onrender.com/api/diary/meal", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`${selectedRecipe.title} додано до ${categories[selectedMealType]}!`);
      setShowAddModal(false);
      setSelectedRecipe(null);
    } catch (err) {
      alert("Помилка додавання рецепту в щоденник");
    }
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: "center", color: "#5B7133", fontSize: "2.5rem", margin: "2rem 0" }}>
        Рецепти
      </h1>

      {/* Фільтр за категорією */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {Object.keys(categories).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className="btn"
            style={{
              background: selectedCategory === key ? "#5B7133" : "#C8D094",
              color: selectedCategory === key ? "white" : "#5B7133",
            }}
          >
            {categories[key]}
          </button>
        ))}
      </div>

      {/* Сітка рецептів */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "2rem",
        }}
      >
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="card"
            style={{ cursor: "pointer", overflow: "hidden" }}
            onClick={() => setSelectedRecipe(recipe)}
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              style={{ width: "100%", height: "220px", objectFit: "cover", borderRadius: "16px 16px 0 0" }}
              onError={(e) => (e.target.src = "https://via.placeholder.com/320x220?text=Рецепт")}
            />
            <div style={{ padding: "1.5rem" }}>
              <h3 style={{ color: "#5B7133", marginBottom: "0.5rem" }}>{recipe.title}</h3>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#5B7133" }}>
                {recipe.calories} ккал
              </p>
              <p style={{ color: "#666", marginTop: "0.5rem" }}>
                Категорія: {categories[recipe.category]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Деталі рецепту при кліку */}
      {selectedRecipe && !showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedRecipe(null)}
        >
          <div
            className="card"
            style={{ width: "600px", maxWidth: "95%", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedRecipe.image}
              alt={selectedRecipe.title}
              style={{ width: "100%", borderRadius: "16px", marginBottom: "1.5rem" }}
            />
            <h2 style={{ color: "#5B7133", textAlign: "center" }}>{selectedRecipe.title}</h2>
            <p style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#5B7133", textAlign: "center" }}>
              {selectedRecipe.calories} ккал
            </p>

            <div style={{ margin: "2rem 0" }}>
              <h3 style={{ color: "#5B7133", marginBottom: "1rem" }}>Інгредієнти:</h3>
              <ul style={{ paddingLeft: "1.5rem", lineHeight: "1.8rem" }}>
                {selectedRecipe.ingredients?.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>

            <div style={{ margin: "2rem 0" }}>
              <h3 style={{ color: "#5B7133", marginBottom: "1rem" }}>Приготування:</h3>
              <p style={{ lineHeight: "1.8rem" }}>{selectedRecipe.instructions}</p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
              style={{ width: "100%", padding: "1rem", fontSize: "1.2rem" }}
            >
              Додати до щоденника
            </button>

            <button
              onClick={() => setSelectedRecipe(null)}
              style={{ width: "100%", marginTop: "1rem", background: "none", color: "#5B7133", border: "none", cursor: "pointer" }}
            >
              Закрити
            </button>
          </div>
        </div>
      )}

      {/* Модалка вибору прийому їжі */}
      {showAddModal && selectedRecipe && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
          }}
        >
          <div className="card" style={{ width: "400px", textAlign: "center" }}>
            <h3 style={{ color: "#5B7133", marginBottom: "1.5rem" }}>
              Додати "{selectedRecipe.title}" до:
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {["breakfast", "lunch", "dinner", "snack"].map((meal) => (
                <button
                  key={meal}
                  onClick={async () => {
                    const data = {
                      mealType: meal,
                      foodName: selectedRecipe.title,
                      calories: selectedRecipe.calories,
                      protein: selectedRecipe.protein || 0,
                      carbs: selectedRecipe.carbs || 0,
                      fat: selectedRecipe.fat || 0,
                    };

                    try {
                      const token = await auth.currentUser.getIdToken();
                      await axios.post("https://nutriwave-backend.onrender.com/api/diary/meal", data, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      alert(`${selectedRecipe.title} додано до ${categories[meal]}!`);
                      setShowAddModal(false);
                      setSelectedRecipe(null);
                    } catch (err) {
                      alert("Помилка додавання");
                    }
                  }}
                  className="btn btn-primary"
                >
                  {categories[meal]}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              style={{ marginTop: "1.5rem", background: "none", color: "#5B7133", border: "none", cursor: "pointer" }}
            >
              Скасувати
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;