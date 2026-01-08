import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../services/firebase";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    gender: "female",
    activityLevel: "sedentary",
    goal: "lose",
  });

  // Формула Міффліна-Сан Жеора
  const calculateBMR = (weight, height, age, gender) => {
    if (gender === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  const activityMultiplier = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const goalAdjustment = {
    lose: -500,
    maintain: 0,
    gain: 500,
  };

  const calculateDailyCalories = () => {
    if (!profile || !profile.age) return 0;
    const bmr = calculateBMR(profile.currentWeight, profile.height, profile.age, profile.gender);
    const tdee = bmr * activityMultiplier[profile.activityLevel];
    const adjusted = tdee + goalAdjustment[profile.goal];
    return Math.round(adjusted);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;

      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get("https://nutriwave-backend.onrender.com/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        if (res.data.age) {
          setForm({
            name: res.data.name || "",
            age: res.data.age || "",
            height: res.data.height || "",
            weight: res.data.currentWeight || "",
            gender: res.data.gender || "female",
            activityLevel: res.data.activityLevel || "sedentary",
            goal: res.data.goal || "lose",
          });
        }
      } catch (err) {
        console.log("Профіль не знайдено — потрібно заповнити");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        "https://nutriwave-backend.onrender.com/api/users/me",
        {
          name: form.name,
          age: parseInt(form.age),
          weight: parseFloat(form.weight),
          height: parseInt(form.height),
          gender: form.gender,
          goal: form.goal,
          activityLevel: form.activityLevel,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Профіль збережено!");
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      alert("Помилка збереження");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f8f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Завантаження...
      </div>
    );
  }

  const userPhoto = auth.currentUser?.photoURL || "https://via.placeholder.com/140?text=Фото";

  // Обов'язкова форма при першому вході або редагуванні
  if (!profile || !profile.age || isEditing) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f8f5" }}>
        <div className="container" style={{ display: "flex", justifyContent: "center", paddingTop: "2rem" }}>
          <div className="card" style={{ width: "550px", maxWidth: "95%" }}>
            <h2 style={{ textAlign: "center", color: "#5B7133", marginBottom: "0.5rem" }}>
              {isEditing ? "Редагувати профіль" : "Заповніть профіль"}
            </h2>
            <p style={{ textAlign: "center", color: "#666", marginBottom: "2rem" }}>
              Ці дані потрібні для розрахунку калорій
            </p>

            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <img
                src={userPhoto}
                alt="Фото профілю"
                style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", border: "4px solid #C8D094" }}
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#5B7133", fontWeight: "600" }}>
                  Ім'я (необов'язково)
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", border: "1px solid #C8D094" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "#5B7133", fontWeight: "600" }}>
                    Вік
                  </label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    required
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", border: "1px solid #C8D094" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "#5B7133", fontWeight: "600" }}>
                    Зріст (см)
                  </label>
                  <input
                    type="number"
                    value={form.height}
                    onChange={(e) => setForm({ ...form, height: e.target.value })}
                    required
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", border: "1px solid #C8D094" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#5B7133", fontWeight: "600" }}>
                  Вага (кг)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", border: "1px solid #C8D094" }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#5B7133", fontWeight: "600" }}>
                  Стать
                </label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", border: "1px solid #C8D094" }}
                >
                  <option value="female">Жіноча</option>
                  <option value="male">Чоловіча</option>
                </select>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#5B7133", fontWeight: "600" }}>
                  Рівень активності
                </label>
                <select
                  value={form.activityLevel}
                  onChange={(e) => setForm({ ...form, activityLevel: e.target.value })}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", border: "1px solid #C8D094" }}
                >
                  <option value="sedentary">Сидячий</option>
                  <option value="light">Легка</option>
                  <option value="moderate">Помірна</option>
                  <option value="active">Висока</option>
                  <option value="very_active">Дуже висока</option>
                </select>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#5B7133", fontWeight: "600" }}>
                  Ціль
                </label>
                <select
                  value={form.goal}
                  onChange={(e) => setForm({ ...form, goal: e.target.value })}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", border: "1px solid #C8D094" }}
                >
                  <option value="lose">Схуднути</option>
                  <option value="maintain">Підтримувати вагу</option>
                  <option value="gain">Набрати вагу</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "1rem", fontSize: "1.1rem" }}>
                {isEditing ? "Зберегти зміни" : "Зберегти та продовжити"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Перегляд профілю після заповнення
  const dailyCalories = calculateDailyCalories();

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f5" }}>
      <div className="container">
        <div className="card" style={{ textAlign: "center" }}>
          <img
            src={userPhoto}
            alt="Фото профілю"
            style={{ width: "140px", height: "140px", borderRadius: "50%", objectFit: "cover", border: "5px solid #C8D094", marginBottom: "1.5rem" }}
          />

          <h2 style={{ color: "#5B7133", marginBottom: "1rem" }}>
            {profile.name || auth.currentUser?.displayName || "Користувач"}
          </h2>

          <div style={{ lineHeight: "2rem", fontSize: "1.1rem", marginBottom: "2rem" }}>
            <p><strong>Вік:</strong> {profile.age} років</p>
            <p><strong>Зріст:</strong> {profile.height} см</p>
            <p><strong>Вага:</strong> {profile.currentWeight} кг</p>
            <p><strong>Стать:</strong> {profile.gender === "female" ? "Жіноча" : "Чоловіча"}</p>
            <p><strong>Активність:</strong> {
              {
                sedentary: "Сидячий",
                light: "Легка",
                moderate: "Помірна",
                active: "Висока",
                very_active: "Дуже висока",
              }[profile.activityLevel]
            }</p>
            <p><strong>Ціль:</strong> {
              {
                lose: "Схуднути",
                maintain: "Підтримувати вагу",
                gain: "Набрати вагу",
              }[profile.goal]
            }</p>
          </div>

          <div className="card" style={{ background: "#C8D094", padding: "1.5rem", marginBottom: "2rem" }}>
            <h3 style={{ color: "#5B7133", marginBottom: "0.5rem" }}>Рекомендовані калорії на день</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#5B7133" }}>{dailyCalories} ккал</p>
            <p style={{ color: "#5B7133" }}>
              Розраховано за формулою Міффліна-Сан Жеора з урахуванням вашої активності та цілі
            </p>
          </div>

          {/* === ДОДАНИЙ БЛОК ПРО ВИБРАНУ ПРОГРАМУ === */}
          {profile?.selectedProgram && (
            <div className="card" style={{ background: "#C8D094", textAlign: "center", marginBottom: "2rem" }}>
              <p style={{ fontSize: "1.3rem", color: "#5B7133" }}>
                Вибрана програма: <strong>{profile.selectedProgram}</strong>
              </p>
            </div>
          )}

          <button
            className="btn btn-primary"
            style={{ width: "100%", padding: "1rem" }}
            onClick={() => setIsEditing(true)}
          >
            Редагувати профіль
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;