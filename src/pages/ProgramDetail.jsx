import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../services/firebase";

const ProgramDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const programs = {
    keto: {
      title: "Кето дієта",
      description: "Низьковуглеводна дієта з високим вмістом жирів для швидкого схуднення.",
      benefits: ["Швидке схуднення", "Зниження апетиту", "Стабільна енергія"],
      allowed: "М'ясо, риба, яйця, авокадо, горіхи, олія, вершки",
      forbidden: "Цукор, хліб, макарони, крупи, фрукти з високим вмістом вуглеводів",
      tips: "Пийте багато води, стежте за електролітами, додайте сіль",
    },
    intermittent: {
      title: "16:8 Інтервальне голодування",
      description: "Їжа в 8-годинному вікні, голодування 16 годин.",
      benefits: ["Схуднення", "Покращення чутливості до інсуліну", "Клітинне очищення"],
      allowed: "Будь-яка їжа у вікні харчування",
      forbidden: "Їжа поза вікном (крім води, чаю, кави без цукру)",
      tips: "Почніть з 12:12, поступово збільшуйте до 16:8",
    },
    pescetarian: {
      title: "Пескетаріанство",
      description: "Рослинна дієта з рибою та морепродуктами.",
      benefits: ["Багато омега-3", "Здоров'я серця", "Екологічність"],
      allowed: "Риба, овочі, фрукти, зернові, молочні продукти",
      forbidden: "М'ясо птиці та червоне м'ясо",
      tips: "Їжте жирну рибу 2-3 рази на тиждень",
    },
    vegan: {
      title: "Веган меню",
      description: "Повністю рослинна дієта без продуктів тваринного походження.",
      benefits: ["Здоров'я серця", "Екологічність", "Багато клітковини"],
      allowed: "Овочі, фрукти, бобові, горіхи, зернові, рослинне молоко",
      forbidden: "М'ясо, риба, яйця, молочні продукти, мед",
      tips: "Додавайте B12 та омега-3 з добавок",
    },
    highprotein: {
      title: "Високобілкове схуднення",
      description: "Збільшений білок для збереження м'язів при схудненні.",
      benefits: ["Збереження м'язів", "Довше насичення", "Прискорення метаболізму"],
      allowed: "Курка, риба, яйця, сир, грецький йогурт, бобові",
      forbidden: "Обмежити прості вуглеводи",
      tips: "Ціль — 1.6-2.2г білка на кг ваги",
    },
    vegetarian: {
      title: "Вегетаріанство",
      description: "Без м'яса, але з молочними продуктами та яйцями.",
      benefits: ["Багато клітковини", "Зниження холестерину"],
      allowed: "Овочі, фрукти, зернові, молочні продукти, яйця",
      forbidden: "М'ясо, риба",
      tips: "Стежте за залізом та B12",
    },
  };

  const program = programs[id] || programs.keto;

  const handleSelectProgram = async () => {
    if (!auth.currentUser) {
      alert("Будь ласка, увійдіть у свій акаунт");
      return;
    }

    if (!confirm(`Вибрати програму "${program.title}"?`)) return;

    setLoading(true);

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        "https://nutriwave-backend1.vercel.app/api/users/me",
        { selectedProgram: program.title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Програму "${program.title}" вибрано! Тепер вона відображається в профілі.`);
      navigate("/profile");
    } catch (err) {
      console.error("Помилка вибору програми:", err);
      alert("Помилка вибору програми. Перевірте підключення до бекенду.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <button
        onClick={() => navigate("/programs")}
        className="btn btn-outline"
        style={{ marginBottom: "2rem" }}
      >
        ← Назад до програм
      </button>

      <div className="card">
        <h1 style={{ textAlign: "center", color: "#5B7133", fontSize: "2.5rem", marginBottom: "1rem" }}>
          {program.title}
        </h1>

        <p style={{ fontSize: "1.2rem", lineHeight: "1.8rem", marginBottom: "2rem" }}>
          {program.description}
        </p>

        <h3 style={{ color: "#5B7133", marginBottom: "1rem" }}>Переваги:</h3>
        <ul style={{ paddingLeft: "1.5rem", lineHeight: "1.8rem", marginBottom: "2rem" }}>
          {program.benefits.map((benefit, i) => (
            <li key={i}>{benefit}</li>
          ))}
        </ul>

        <h3 style={{ color: "#5B7133", marginBottom: "1rem" }}>Дозволені продукти:</h3>
        <p style={{ marginBottom: "2rem" }}>{program.allowed}</p>

        <h3 style={{ color: "#5B7133", marginBottom: "1rem" }}>Заборонені продукти:</h3>
        <p style={{ marginBottom: "2rem" }}>{program.forbidden}</p>

        <h3 style={{ color: "#5B7133", marginBottom: "1rem" }}>Поради:</h3>
        <p style={{ marginBottom: "2rem" }}>{program.tips}</p>

        <button
          onClick={handleSelectProgram}
          className="btn btn-primary"
          style={{ width: "100%", padding: "1rem", fontSize: "1.2rem" }}
          disabled={loading}
        >
          {loading ? "Вибираємо..." : "Вибрати цю програму"}
        </button>
      </div>
    </div>
  );
};

export default ProgramDetail;