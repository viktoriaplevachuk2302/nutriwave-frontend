import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc, onSnapshot, arrayUnion, increment } from "firebase/firestore";

const Dashboard = () => {
  const [diary, setDiary] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    waterGlasses: 0,
    waterLiters: 0,
    meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
  });
  const [profile, setProfile] = useState(null);
  const [recommendedCalories, setRecommendedCalories] = useState(1465);
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
    breakfast: { title: "Сніданок", icon: "🥞", range: "366-513 ккал", max: 513 },
    lunch: { title: "Обід", icon: "🍲", range: "439-586 ккал", max: 586 },
    dinner: { title: "Вечеря", icon: "🥗", range: "571-747 ккал", max: 747 },
    snack: { title: "Перекус", icon: "🍎", range: "0-88 ккал", max: 88 },
  };

  const getMealCardColor = (calories, max) => {
    if (calories <= max) return "#C8D094";
    if (calories <= max * 1.1) return "#f0e68c";
    if (calories <= max * 1.3) return "#ffcc80";
    return "#ff8a80";
  };

  const calculateDailyCalories = (p) => {
    if (!p || !p.age || !p.height || !p.currentWeight || !p.gender) return 1465;

    let bmr = p.gender === "male"
      ? 10 * p.currentWeight + 6.25 * p.height - 5 * p.age + 5
      : 10 * p.currentWeight + 6.25 * p.height - 5 * p.age - 161;

    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const tdee = bmr * (multipliers[p.activityLevel] || 1.2);

    const adjustments = {
      lose: -500,
      maintain: 0,
      gain: 500,
    };

    return Math.round(tdee + adjustments[p.goal]);
  };

  useEffect(() => {
    if (!auth.currentUser) return;

    setLoading(true);

    const date = new Date().toISOString().split("T")[0];
    const diaryRef = doc(db, "users", auth.currentUser.uid, "diary", date);

    // Real-time оновлення (onSnapshot)
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

    const fetchProfile = async () => {
      const profileRef = doc(db, "users", auth.currentUser.uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const data = profileSnap.data();
        setProfile(data);
        setRecommendedCalories(calculateDailyCalories(data));
      }
    };

    fetchProfile();
    setLoading(false);

    return () => unsubscribe();
  }, []);

  const consumed = diary.totalCalories || 0;

  const openMealModal = (mealType) => {
    setSelectedMeal(mealType);
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
      const date = new Date().toISOString().split("T")[0];
      const diaryRef = doc(db, "users", auth.currentUser.uid, "diary", date);

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

  const addWater = async () => {
    if (diary.waterGlasses >= 8) return;

    try {
      const date = new Date().toISOString().split("T")[0];
      const diaryRef = doc(db, "users", auth.currentUser.uid, "diary", date);

      await setDoc(diaryRef, {
        waterGlasses: increment(1),
        waterLiters: increment(0.25),
      }, { merge: true });
    } catch (err) {
      console.error("Помилка додавання води:", err);
      alert("Помилка додавання води");
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "4rem", fontSize: "1.5rem" }}>Завантаження...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: "center", color: "#5B7133", fontSize: "2.5rem", margin: "2rem 0" }}>
        Сьогодні
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
        {/* Ліва частина — калорії та макроси */}
        <div className="card" style={{ textAlign: "center" }}>
          <div className="progress-circle">
            <svg width="280" height="280" viewBox="0 0 280 280">
              <circle cx="140" cy="140" r="120" fill="none" stroke="#e8f0e0" strokeWidth="25" />
              <circle
                cx="140"
                cy="140"
                r="120"
                fill="none"
                stroke="#5B7133"
                strokeWidth="25"
                strokeDasharray="754"
                strokeDashoffset={754 - (754 * consumed / recommendedCalories)}
                className="progress-fill"
              />
            </svg>
            <div className="progress-text">
              <strong>{consumed}</strong>
              <span>з {recommendedCalories} ккал</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginTop: "2rem" }}>
            <div className="macro-item">
              <strong>Вуглеводи</strong>
              <div>{diary.totalCarbs || 0}г</div>
            </div>
            <div className="macro-item">
              <strong>Білки</strong>
              <div>{diary.totalProtein || 0}г</div>
            </div>
            <div className="macro-item">
              <strong>Жири</strong>
              <div>{diary.totalFat || 0}г</div>
            </div>
          </div>
        </div>

        {/* Права частина — картки прийомів їжі з повним списком страв */}
        <div>
          {Object.keys(mealData).map((meal) => {
            const { title, icon, range, max } = mealData[meal];
            const foods = diary.meals?.[meal] || [];
            const mealCalories = foods.reduce((sum, item) => sum + (item.calories || 0), 0);
            const cardColor = getMealCardColor(mealCalories, max);

            return (
              <div
                key={meal}
                className="meal-card"
                style={{ background: cardColor, marginBottom: "1rem", cursor: "pointer" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>
                      {icon} {title}
                    </h3>
                    <p style={{ color: "#5B7133", marginBottom: "0.5rem" }}>
                      Рекомендовано: {range}
                    </p>
                    <p style={{ fontSize: "1.8rem", fontWeight: "bold" }}>{mealCalories} ккал</p>
                  </div>
                  <button
                    onClick={() => openMealModal(meal)}
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

                {/* Список доданих страв */}
                {foods.length > 0 ? (
                  <div style={{ marginTop: "1rem" }}>
                    {foods.map((food, index) => (
                      <div
                        key={index}
                        style={{
                          background: "rgba(255,255,255,0.8)",
                          padding: "0.75rem",
                          borderRadius: "8px",
                          marginBottom: "0.5rem",
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>
                    Немає записів
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Блок води */}
      <div className="card" style={{ marginTop: "3rem" }}>
        <h3 style={{ textAlign: "center", color: "#5B7133", marginBottom: "1.5rem" }}>
          Вода сьогодні
        </h3>
        <p style={{ textAlign: "center", fontSize: "1.2rem", marginBottom: "1.5rem" }}>
          Випито: {(diary.waterLiters || 0).toFixed(1)} л з 2 л
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              onClick={() => diary.waterGlasses <= i && addWater()}
              style={{
                width: "60px",
                height: "80px",
                background: diary.waterGlasses > i ? "#5B7133" : "#e8f0e0",
                borderRadius: "10px 10px 30px 30px",
                cursor: diary.waterGlasses <= i ? "pointer" : "default",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: "10px",
                color: diary.waterGlasses > i ? "white" : "#5B7133",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              {i + 1}
            </div>
          ))}
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

export default Dashboard;