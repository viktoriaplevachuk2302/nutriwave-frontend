import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc, onSnapshot, arrayUnion, increment } from "firebase/firestore";

const Diary = () => {
  const [diary, setDiary] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    waterGlasses: 0,
    waterLiters: 0,
    meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState("");
  const [foodForm, setFoodForm] = useState({
    foodName: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const mealData = {
    breakfast: { title: "Сніданок", range: "366-513 ккал", max: 513 },
    lunch: { title: "Обід", range: "439-586 ккал", max: 586 },
    dinner: { title: "Вечеря", range: "571-747 ккал", max: 747 },
    snack: { title: "Перекус", range: "0-88 ккал", max: 88 },
  };

  const getMealCardColor = (calories, max) => {
    if (calories <= max) return "#C8D094";
    if (calories <= max * 1.1) return "#f0e68c";
    if (calories <= max * 1.3) return "#ffcc80";
    return "#ff8a80";
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("uk-UA", options);
  };

  useEffect(() => {
    if (!auth.currentUser) return;

    setLoading(true);

    const diaryRef = doc(db, "users", auth.currentUser.uid, "diary", selectedDate);

    // Real-time слухач змін (onSnapshot)
    const unsubscribe = onSnapshot(diaryRef, async (snap) => {
      let diaryData = {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        waterGlasses: 0,
        waterLiters: 0,
        meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
      };

      if (snap.exists()) {
        diaryData = snap.data();
      } else {
        // Якщо документа немає — створюємо порожній
        await setDoc(diaryRef, diaryData);
      }

      setDiary(diaryData);
    });

    setLoading(false);

    return () => unsubscribe();
  }, [selectedDate]);

  const openAddModal = (meal) => {
    setSelectedMeal(meal);
    setShowModal(true);
    setFoodForm({ foodName: "", calories: "", protein: "", carbs: "", fat: "" });
  };

  const handleAddFood = async (e) => {
    e.preventDefault();

    const newFood = {
      foodName: foodForm.foodName,
      calories: parseInt(foodForm.calories) || 0,
      protein: parseFloat(foodForm.protein) || 0,
      carbs: parseFloat(foodForm.carbs) || 0,
      fat: parseFloat(foodForm.fat) || 0,
      addedAt: new Date().toISOString(),
    };

    try {
      const diaryRef = doc(db, "users", auth.currentUser.uid, "diary", selectedDate);

      // Перевіряємо, чи існує документ (щоб уникнути помилок)
      const docSnap = await getDoc(diaryRef);
      if (!docSnap.exists()) {
        await setDoc(diaryRef, {
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          waterGlasses: 0,
          waterLiters: 0,
          meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
        });
      }

      // Додаємо їжу
      await setDoc(diaryRef, {
        [`meals.${selectedMeal}`]: arrayUnion(newFood),
        totalCalories: increment(newFood.calories),
        totalProtein: increment(newFood.protein),
        totalCarbs: increment(newFood.carbs),
        totalFat: increment(newFood.fat),
      }, { merge: true });

      alert(" Їжу додано!");
      setShowModal(false);
    } catch (err) {
      console.error("Помилка додавання їжі:", err);
      alert("Помилка додавання їжі");
    }
  };

  const handleDeleteFood = async (mealType, index) => {
    if (!confirm("Видалити цю страву?")) return;

    try {
      const diaryRef = doc(db, "users", auth.currentUser.uid, "diary", selectedDate);
      const docSnap = await getDoc(diaryRef);
      if (!docSnap.exists()) return;

      const diaryData = docSnap.data();
      const foods = diaryData.meals?.[mealType] || [];
      const removedFood = foods[index];

      const updatedFoods = foods.filter((_, i) => i !== index);

      await setDoc(diaryRef, {
        [`meals.${mealType}`]: updatedFoods,
        totalCalories: increment(-removedFood.calories),
        totalProtein: increment(-(removedFood.protein || 0)),
        totalCarbs: increment(-(removedFood.carbs || 0)),
        totalFat: increment(-(removedFood.fat || 0)),
      }, { merge: true });

      setDiary(prev => ({
        ...prev,
        totalCalories: (prev.totalCalories || 0) - removedFood.calories,
        totalProtein: (prev.totalProtein || 0) - (removedFood.protein || 0),
        totalCarbs: (prev.totalCarbs || 0) - (removedFood.carbs || 0),
        totalFat: (prev.totalFat || 0) - (removedFood.fat || 0),
        meals: {
          ...prev.meals,
          [mealType]: updatedFoods,
        },
      }));

      alert("Страву видалено!");
    } catch (err) {
      console.error("Помилка видалення:", err);
      alert("Помилка видалення");
    }
  };

  const addWater = async () => {
    if (diary.waterGlasses >= 8) return;

    try {
      const date = new Date().toISOString().split("T")[0];
      const diaryRef = doc(db, "users", auth.currentUser.uid, "diary", date);

      await setDoc(diaryRef, {
        waterGlasses: increment(1),
        waterLiters: increment(0.25),
      }, { merge: true });

      alert("Воду додано!");
    } catch (err) {
      console.error("Помилка додавання води:", err);
      alert("Помилка додавання води");
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "4rem", fontSize: "1.5rem" }}>Завантаження щоденника...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: "center", color: "#5B7133", fontSize: "2.5rem", margin: "2rem 0" }}>
        Щоденник їжі
      </h1>

      {/* Вибір дати */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <label style={{ fontSize: "1.2rem", color: "#5B7133", marginRight: "1rem" }}>
          Дата:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: "0.75rem",
            borderRadius: "12px",
            border: "1px solid #C8D094",
            fontSize: "1rem",
            marginRight: "1rem",
          }}
        />
        <button
          onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
          className="btn btn-primary"
          style={{ padding: "0.75rem 1.5rem" }}
        >
          Сьогодні
        </button>
      </div>

      <p style={{ textAlign: "center", fontSize: "1.3rem", color: "#5B7133", marginBottom: "2rem" }}>
        {formatDate(selectedDate)}
      </p>

      {Object.keys(mealData).map((meal) => {
        const { title, range, max } = mealData[meal];
        const foods = diary.meals?.[meal] || [];
        const mealCalories = foods.reduce((sum, f) => sum + (f.calories || 0), 0);
        const cardColor = getMealCardColor(mealCalories, max);

        return (
          <div key={meal} className="card" style={{ background: cardColor, marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ color: "#5B7133" }}>{title}</h2>
              <div>
                <p style={{ color: "#5B7133", fontWeight: "600" }}>Рекомендовано: {range}</p>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{mealCalories} ккал</p>
              </div>
              <button
                onClick={() => openAddModal(meal)}
                style={{
                  background: "#5B7133",
                  color: "white",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  fontSize: "2rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>

            {foods.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>
                Немає записів за цю дату
              </p>
            ) : (
              <div>
                {foods.map((food, index) => (
                  <div
                    key={index}
                    style={{
                      background: "rgba(255,255,255,0.8)",
                      padding: "1rem",
                      borderRadius: "12px",
                      marginBottom: "0.75rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>{food.foodName}</strong>
                      <div style={{ fontSize: "0.9rem", color: "#555" }}>
                        {food.calories} ккал · Б: {food.protein}г · В: {food.carbs}г · Ж: {food.fat}г
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteFood(meal, index)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#d32f2f",
                        fontSize: "1.8rem",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Підсумок за день */}
      <div className="card" style={{ background: "#C8D094", textAlign: "center" }}>
        <h3 style={{ color: "#5B7133", marginBottom: "1rem" }}>Підсумок за {formatDate(selectedDate)}</h3>
        <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#5B7133" }}>
          {diary.totalCalories} ккал
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "1rem" }}>
          <div>
            <strong>Білки</strong>
            <div>{diary.totalProtein || 0}г</div>
          </div>
          <div>
            <strong>Вуглеводи</strong>
            <div>{diary.totalCarbs || 0}г</div>
          </div>
          <div>
            <strong>Жири</strong>
            <div>{diary.totalFat || 0}г</div>
          </div>
        </div>
      </div>

      {/* Модалка додавання їжі */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div className="card" style={{ width: "500px", maxWidth: "95%" }}>
            <h3 style={{ textAlign: "center", color: "#5B7133", marginBottom: "1.5rem" }}>
              Додати їжу до {mealData[selectedMeal]?.title}
            </h3>
            <form onSubmit={handleAddFood}>
              <input
                type="text"
                placeholder="Назва їжі"
                value={foodForm.foodName}
                onChange={(e) => setFoodForm({ ...foodForm, foodName: e.target.value })}
                required
                style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", borderRadius: "12px", border: "1px solid #C8D094" }}
              />
              <input
                type="number"
                placeholder="Калорії"
                value={foodForm.calories}
                onChange={(e) => setFoodForm({ ...foodForm, calories: e.target.value })}
                required
                style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", borderRadius: "12px", border: "1px solid #C8D094" }}
              />
              <input
                type="number"
                step="0.1"
                placeholder="Білки (г)"
                value={foodForm.protein}
                onChange={(e) => setFoodForm({ ...foodForm, protein: e.target.value })}
                required
                style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", borderRadius: "12px", border: "1px solid #C8D094" }}
              />
              <input
                type="number"
                step="0.1"
                placeholder="Вуглеводи (г)"
                value={foodForm.carbs}
                onChange={(e) => setFoodForm({ ...foodForm, carbs: e.target.value })}
                required
                style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", borderRadius: "12px", border: "1px solid #C8D094" }}
              />
              <input
                type="number"
                step="0.1"
                placeholder="Жири (г)"
                value={foodForm.fat}
                onChange={(e) => setFoodForm({ ...foodForm, fat: e.target.value })}
                required
                style={{ width: "100%", padding: "0.75rem", marginBottom: "2rem", borderRadius: "12px", border: "1px solid #C8D094" }}
              />

              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Додати
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Скасувати
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Diary;